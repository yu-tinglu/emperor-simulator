from playwright.sync_api import sync_playwright
def clk(pg,sel): pg.evaluate("document.querySelector(%r).dispatchEvent(new MouseEvent('click',{bubbles:true}))"%sel)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':390,'height':780});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file:///home/claude/emperor/index.html');pg.wait_for_timeout(500)
    clk(pg,'.splash [data-act=enter]');clk(pg,'[data-act=scn][data-arg=a]');clk(pg,'[data-act=begin]');pg.wait_for_timeout(300)
    pg.screenshot(path='p1.png')
    clk(pg,'#md [data-act=pron]');clk(pg,'#md [data-act=pron]');clk(pg,'#md [data-act=pron]');pg.wait_for_timeout(200);pg.screenshot(path='p2.png')
    clk(pg,'#md [data-act=proc][data-arg="1"]');pg.wait_for_timeout(600);pg.screenshot(path='p3.png')
    clk(pg,'#md [data-act=mandset]');pg.wait_for_timeout(300)
    print(pg.evaluate("[G.pro&&G.pro.i,G.mandate&&G.mandate.k,!!document.querySelector('.card.mand')]"),errs)
    pg.evaluate("document.querySelector('.card.mand').scrollIntoView()");pg.screenshot(path='p4.png')
