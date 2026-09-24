Launch video pipeline (23 Sep 2026)

comp.html   the video: render(t) draws the frame for time t (1920x1080)
shoot2.py   captures hi-DPI screenshots of the app with Playwright
preview.py  renders a few chosen times to PNG for checking
render.py   renders all 1500 frames (30 fps x 50 s) as JPEGs
music.py    synthesises the soundtrack and mixes in the app's voice clips

comp.html expects these folders beside it (symlinks in the original run):
  pages/  -> book pages as PNG (pdftoppm -r 150 -png st_unit1.pdf p)
  cap/    -> screenshots from shoot2.py
  vocab/  -> unit1/assets/images_v2/vocab
  fonts/  -> assets/fonts (the site's self-hosted fonts)
Paths inside the scripts are the cloud workspace's (/home/claude/...); adjust them.

Final join:
ffmpeg -framerate 30 -i frames/f%05d.jpg -i soundtrack.wav -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest out.mp4
