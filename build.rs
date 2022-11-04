use std::process::Command;
use std::path::Path;
use static_files::resource_dir;

fn main() -> std::io::Result<()> {
    Command::new("ng").arg("build")
        .current_dir(&Path::new("js/"))
        .status().unwrap();

    resource_dir("./js/dist/worldmonitor/").build()
}
