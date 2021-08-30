require "rubygems"
require "sprockets"

GRAMMAR_ASSETS = [
  "application.js",
  "viz.js",
  "application.css"
]

file "src/parser.js" => ["src/parser.l", "src/parser.y"] do
  system "jison src/parser.y src/parser.l --module-type=js --output-file=src/Parser.js && mv src/Parser.js src/parser.js"
end

task :default => "src/parser.js" do
  environment = Sprockets::Environment.new
  environment.append_path "src"
  environment.append_path "lib"
  environment.append_path "styles"

  FileUtils.mkdir_p("build/assets")

  GRAMMAR_ASSETS.each do |asset|
    File.open("build/assets/#{asset}", "w+") do |f|
      f << environment.find_asset(asset).to_s
    end
  end

  FileUtils.cp "index.html", "build/index.html"
end

task :clean do
  GRAMMAR_ASSETS.each do |asset|
    FileUtils.rm_f("build/assets/#{asset}")
  end
  FileUtils.rm_f("build/index.html")
end

task :clobber => :clean do
  FileUtils.rm_f("src/parser.js")
end
