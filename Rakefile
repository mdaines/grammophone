require "rubygems"
require "sprockets"

task :default do
  
  environment = Sprockets::Environment.new
  environment.append_path "src"
  environment.append_path "lib"
  environment.append_path "styles"
  
  FileUtils.mkdir_p("./assets")
  
  ["application.js", "application.css"].each do |asset|
    File.open("./assets/#{asset}", "w+") do |f|
      f << environment.find_asset(asset).to_s
    end
  end
  
end

task :clean do
  
  FileUtils.rm("./assets/application.js")
  FileUtils.rm("./assets/application.css")
  
end

