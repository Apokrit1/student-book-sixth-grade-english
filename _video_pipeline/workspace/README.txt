Copy of the cloud workspace (23 Sep 2026), useful parts only.

pages_150dpi/   Unit 1 book pages at 150 dpi (PNG), used in the video
screenshots_2x/ App screenshots at 2x resolution (3200 px wide, full page)
qa/             Contact sheets used for checking: book pages, app tabs, keyframes,
                sampled frames, soundtrack spectrogram/waveform
svg_fixed/      The five SVGs with "&" corrected to "&amp;". To fix the live app,
                copy them over unit1\assets\images_v2\ (back up the originals first).
final/          soundtrack.wav (16-bit 44.1 kHz) and the full-quality CRF 18 video,
                split in two parts because of the 20 MB transfer limit.
                Rejoin in a Windows command prompt, inside final\:
                  copy /b english6_launch_ictrev_crf18.mp4.part00 + english6_launch_ictrev_crf18.mp4.part01 english6_launch_ictrev_crf18.mp4

Not copied: the 1,500 rendered frames (383 MB; render.py recreates them in ~9 min),
the copies of your own site and the old unit1.zip contents, and test duplicates.
