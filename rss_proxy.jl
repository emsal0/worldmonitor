using HTTP
using Genie 
using LightXML
using JSON

struct Article
    title::String
    content::String
    link::String
end

JSON.json(art::Article) = function(article)
    return json(Dict(
                    "title" => art.title,
                    "content" => art.content,
                    "link" => art.link
                   ))
end

function get_first_nonempty(elt::XMLElement)
    filtered = filter(collect(child_nodes(elt))) do child
        strip(get_text(child)) != ""
    end
    filtered[1]
end

function get_text(text_node::XMLNode)
    if is_cdatanode(text_node)
        @show text_node
        ret = match(r"<\!\[CDATA\[(.*)\]\]>", string(text_node))[1]
    elseif is_textnode(text_node)
        ret = string(text_node)
    end

    return ret
end


function process_article(article::XMLElement)
    title_elt = find_element(article, "title")
    title_text = get_first_nonempty(title_elt)
    title = get_text(title_text)

    link_elt = find_element(article, "link")
    link_text = get_first_nonempty(link_elt)
    link = get_text(link_text)

    description = "ASDF"

    # description_elt = find_element(article, "description")
    # desc_child = collect(child_nodes(description_elt))[1]

    # if length(desc_child) == 0
    #     description = "ASDF"
    # else 
    #     description_text = desc_child[1]
    #     description = get_text(description_text)
    # end

    return Article(title, description, link)
end

function get_articles(url::String)
    r = HTTP.get(url)
    rss_xml = String(r.body)
    rss_root_elt = parse_string(rss_xml) |> root 

    channel_elt = find_element(rss_root_elt, "channel")
    item_elts = get_elements_by_tagname(channel_elt, "item")
    return item_elts
end

route("/feed") do
    n = params(:n,"0")
    articles = map(process_article, get_articles(n))
    json(articles)
end

up(async=false)

