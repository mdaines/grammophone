styles = Rake::FileList["styles/**/*.css"]

file "assets/application.css" => styles do |t|
  File.open("assets/application.css", "w+") do |f|
    t.prereqs.each do |p|
      f << File.read(p) << "\n"
    end
  end
end

file "assets/viz.js" => "lib/viz.js" do
  FileUtils.cp "lib/viz.js", "assets/viz.js"
end

src = Rake::FileList["src/**/*.{js,ejs}"]

file "assets/application.js" => src do
  system "yarn build --outfile assets/application.js"
end

assets = ["assets/application.css", "assets/viz.js", "assets/application.js"]

task :default => assets

task :clean do
  FileUtils.rm_f assets
end
