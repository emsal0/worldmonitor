use actix_cors::Cors;
use actix_web::{get, web, App, HttpServer, Responder};
use serde::{Serialize, Deserialize};
use roxmltree::Document;
use reqwest::Result;

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
        let desc: Option<String> = Some("no desc".to_string());
        Article {
            title: title.unwrap().to_string(),
            link: link.unwrap().to_string(),
            content: desc.unwrap().to_string(),
        }
    }).collect()
}

async fn request_feed(url: &String) -> Result<Vec<Article>> {
    let feed_res = reqwest::get(url)
        .await?
        .text()
        .await?;
    let xml_tree = Document::parse(feed_res.as_str()).unwrap();
    Ok(parse_articles(&xml_tree))
}

#[derive(Deserialize)]
struct FeedQuery {
    n: String,
}

#[get("/feed")]
async fn get_feed(query: web::Query<FeedQuery>) -> impl Responder {
    let article_list = request_feed(&query.n).await;
    let res = match article_list {
        Ok(list) => list,
        Err(_) => Vec::new(),
    };
    web::Json(res)
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
