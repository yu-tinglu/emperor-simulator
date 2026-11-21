import re
css=open('style.css',encoding='utf8').read()+open('shell.css',encoding='utf8').read()
js=''.join(open(f,encoding='utf8').read()+'\n' for f in ['core.js','sim.js','act.js','story.js','world.js','art.js','scene.js','shell.js','ui.js'])
html='''<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>皇帝模擬器</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC:wght@400;700&family=Ma+Shan+Zheng&display=swap" rel="stylesheet">
<style>'''+css+'''</style></head><body>
<div id="amb"></div><div id="wrap"><div id="top"></div><div id="app"></div></div>
<div id="ov"><div id="md"></div></div><div id="toasts"></div>
<script>'''+js+'''</script></body></html>'''
open('index.html','w',encoding='utf8').write(html)
print(len(html))
