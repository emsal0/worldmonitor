use actix_cors::Cors;
use actix_web::{get, web, App, HttpServer, Responder};
use serde::{Serialize, Deserialize};
use roxmltree::{Document, ParsingOptions};
use std::result::Result;

#[derive(Serialize)]
struct Article {
    title: String,
    link: String,
    content: String,
}

fn parse_articles(doc: &roxmltree::Document) -> Vec<Article> {
    let root_node = doc.root();
    let item_nodes: Vec<roxmltree::Node> = root_node.descendants().filter(
        |node| node.has_tag_name("item")).collect();

    item_nodes.iter().map(|node| {
        let title = node.descendants()
            .find(|n| n.has_tag_name("title")).unwrap().descendants()
            .find(|n| n.is_text()).unwrap().text();
        let link = node.descendants()
            .find(|n| n.has_tag_name("link")).unwrap().descendants()
            .find(|n| n.is_text()).unwrap().text();
        let desc: Option<String> = None;
        Article {
            title: title.expect("no title text").to_string(),
            link: link.expect("no link text").to_string(),
            content: desc.unwrap_or("no desc".to_string()),
        }
    }).collect()
}

async fn request_feed(url: &String) -> Result<Vec<Article>, String> {
    let req_client = reqwest::Client::new();
    let feed_res = req_client.get(url)
        .header("Content-Type", "application/rss+xml")
        .fetch_mode_no_cors()
        .send()
        .await
        .unwrap()
        .text()
        .await.unwrap();
    let maybe_xml_tree = Document::parse_with_options(feed_res.as_str(), ParsingOptions { allow_dtd: true, } );
    match maybe_xml_tree {
        Ok(xml_tree) => {
            Ok(parse_articles(&xml_tree))
        },
        Err(err) => {
            println!("URL {}: XML parse error: {}", url, err.to_string());
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
        let cors = Cors::permissive();

        App::new()
            .wrap(cors)
            .route("/hello", web::get().to(|| async { "Hello World!" }))
            .service(get_feed)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
