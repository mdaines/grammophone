require "rubygems"
require "sprockets"

GRAMMAR_ASSETS = [
  "application.js",
  "grammar.js",
  "zepto.js",
  "jquery.js",
  "viz.js",
  "application.css"
]

file "src/grammar.js" => "grammar/bundle.js" do
  FileUtils.cp "grammar/bundle.js", "src/grammar.js"
end

task :default => "src/grammar.js" do
  environment = Sprockets::Environment.new
  environment.append_path "src"
  environment.append_path "lib"
  environment.append_path "styles"

  FileUtils.mkdir_p("assets")

  GRAMMAR_ASSETS.each do |asset|
    File.open("assets/#{asset}", "w+") do |f|
      f << environment.find_asset(asset).to_s
    end
  end
end

task :clean do
  GRAMMAR_ASSETS.each do |asset|
    FileUtils.rm_f("assets/#{asset}")
  end
end

task :clobber => :clean do
  FileUtils.rm_f("src/parser.js")
end
