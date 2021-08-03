styles = Rake::FileList["styles/**/*.css"]

file "build/assets/application.css" => styles do |t|
  File.open("build/assets/application.css", "w+") do |f|
    t.prereqs.each do |p|
      f << File.read(p) << "\n"
    end
  end
end

file "build/assets/viz.js" => "lib/viz.js" do
  FileUtils.cp "lib/viz.js", "build/assets/viz.js"
end

src = Rake::FileList["src/**/*.{js,ejs}"]

file "build/assets/application.js" => src do
  system "yarn build --outfile build/assets/application.js"
end

file "build/index.html" => "index.html" do
  FileUtils.cp "index.html", "build/index.html"
end

assets = ["build/assets/application.css", "build/assets/viz.js", "build/assets/application.js", "build/index.html"]

directory "build"
file "build" => assets

task :default => "build"

task :clean do
  FileUtils.rm_f assets
end
