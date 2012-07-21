require "sprockets"

map "/assets" do
  environment = Sprockets::Environment.new
  environment.append_path "src"
  environment.append_path "lib"
  environment.append_path "styles"
  run environment
end

# Read index.html from disk for every path not under /assets.

map "/" do
  run proc { [200, { "Content-Type" => "text/html" }, [File.read("./index.html")] ] }
end
