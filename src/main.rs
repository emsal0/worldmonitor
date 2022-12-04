use actix_cors::Cors;
use actix_web::{get, web, App, HttpServer, Responder};
use actix_web_static_files::ResourceFiles;
use serde::{Serialize, Deserialize};
use roxmltree::{Document, ParsingOptions};
use std::result::Result;

include!(concat!(env!("OUT_DIR"), "/generated.rs"));

#[allow(non_snake_case)]
#[derive(Serialize)]
struct Article {
    title: String,
    link: String,
    content: String,
    pubDate: String,
}

fn get_field<'a>(node: &'a roxmltree::Node,
             field_name: &'static str) -> Option<&'a str> {
    let find_tag_res = node.descendants()
        .find(|n| n.has_tag_name(field_name));

    match find_tag_res {
        Some(tag_node) => {
            let find_text_res = tag_node.descendants().find(|n| n.is_text());
            match find_text_res {
                Some(n) => Some(n.text().unwrap_or("")),
                None => Some("")
            }
        },
        None => None
    }
}

fn parse_articles(doc: &roxmltree::Document) -> Vec<Article> {
    let root_node = doc.root();
    let item_nodes: Vec<roxmltree::Node> = root_node.descendants().filter(
        |node| node.has_tag_name("item")).collect();

    item_nodes.iter().map(|node| {
        let title = get_field(&node, "title");
        let link = get_field(&node, "link");
        let desc: Option<&str> = None;
        let pub_date = match get_field(&node, "pubDate") {
            None =>
                get_field(&node, "dc:date"),
            Some(s) => Some(s)
        };

        #[allow(non_snake_case)]
        Article {
            title: title.unwrap_or("no title").to_string(),
            link: link.unwrap_or("no link text").to_string(),
            content: desc.unwrap_or("no desc").to_string(),
            pubDate: pub_date.unwrap_or("no link text").to_string(),
        }
    }).collect()
}

async fn request_feed(url: &String) -> Result<Vec<Article>, String> {
    let req_client = reqwest::Client::new();
    let feed_res = req_client.get(url)
        .header("Content-Type", "application/rss+xml")
        .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8")
        .header("User-Agent", "worldmonitor/1.0")
        .fetch_mode_no_cors()
        .send()
        .await
        .unwrap()
        .text()
        .await.unwrap();
    let res_clone = feed_res.clone();
    //let split = res_clone.as_str().split("\n");
    //let split_vec: Vec<&str> = split.collect();
    let maybe_xml_tree = Document::parse_with_options(feed_res.as_str(), ParsingOptions { allow_dtd: true, } );
    match maybe_xml_tree {
        Ok(xml_tree) => {
            Ok(parse_articles(&xml_tree))
        },
        Err(err) => {
            //let rowpos = err.pos().row - 1;
            println!("URL {}: XML parse error: {}; row text: {}", url, err.to_string(),
                res_clone);
            Err("".to_string())
        }
    }
}

#[derive(Deserialize)]
struct FeedQuery {
    n: String,
}

#[get("/feed")]
async fn get_feed(query: web::Query<FeedQuery>) -> impl Responder {
    let article_list = request_feed(&query.n).await;
    match article_list {
        Ok(list) => web::Json(list),
        Err(_) => web::Json(Vec::new()),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {

        let generated = generate();
        let cors = Cors::permissive();

        App::new()
            .wrap(cors)
            .service(get_feed)
            .service(ResourceFiles::new("/", generated))
            .route("/hello", web::get().to(|| async { "Hello World!" }))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
