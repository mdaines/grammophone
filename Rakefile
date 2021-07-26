require "rubygems"
require "sprockets"

GRAMMAR_ASSETS = [
  "grammar.js",
  "viz.js",
  "application.css"
]

file "src/grammar.js" do
  Dir.chdir "grammar" do
    system "yarn build --outfile ../src/grammar.js"
  end
end

task :default => "src/grammar.js" do
  environment = Sprockets::Environment.new
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
