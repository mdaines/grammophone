require "rake/clean"

css_files = Rake::FileList["styles/**/*.css"]
javascript_files = Rake::FileList["src/**/*.js"]

directory "build"
directory "build/assets"

file "build/assets/application.css" => "build/assets"
file "build/assets/application.css" => css_files do |t|
  File.open("build/assets/application.css", "w+") do |f|
    css_files.each do |p|
      f << File.read(p) << "\n"
    end
  end
end

file "build/assets/application.js" => "build/assets"
file "build/assets/application.js" => javascript_files do
  system "yarn build"
end

file "build/assets/viz.js" => "build/assets"
file "build/assets/lite.render.js" => "lib/lite.render.js" do
  FileUtils.cp "lib/lite.render.js", "build/assets"
end

file "build/assets/viz.js" => "build/assets"
file "build/assets/viz.js" => "lib/viz.js" do
  FileUtils.cp "lib/viz.js", "build/assets"
end

file "build/index.html" => "build"
file "build/index.html" => "index.html" do
  FileUtils.cp "index.html", "build/index.html"
end

build_files = [
  "build/assets/application.css",
  "build/assets/application.js",
  "build/assets/viz.js",
  "build/assets/lite.render.js",
  "build/index.html"
]

CLOBBER.add build_files
CLOBBER.add "build"
CLOBBER.add "build/assets"

task :default => build_files
