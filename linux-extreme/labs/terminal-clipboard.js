// Clipboard integration shared by all Linux Extreme xterm consoles.
"use strict";
window.installLinuxTerminalClipboard=function(term,host){
 const menu=document.createElement("div");
 menu.className="lx-copy-menu";menu.hidden=true;menu.setAttribute("role","menu");
 const copy=document.createElement("button");copy.type="button";copy.setAttribute("role","menuitem");copy.textContent="复制选中文字  Ctrl+C";
 menu.append(copy);document.body.append(menu);
 const notice=document.createElement("div");notice.className="lx-copy-notice";notice.setAttribute("role","status");document.body.append(notice);
 const style=document.createElement("style");style.textContent=".lx-copy-menu{position:fixed;z-index:10000;padding:5px;border:1px solid #45647d;border-radius:8px;background:#142235;box-shadow:0 8px 24px #0008}.lx-copy-menu[hidden]{display:none!important}.lx-copy-menu button{display:block;width:100%;text-align:left;white-space:nowrap;padding:9px 12px;background:transparent;border:0;color:#e7f5ff;font:14px system-ui;cursor:pointer}.lx-copy-menu button:hover,.lx-copy-menu button:focus{background:#29465c;outline:none}.lx-copy-menu button:disabled{opacity:.45;cursor:default}.lx-copy-notice{position:fixed;z-index:10001;bottom:14px;right:14px;max-width:90%;background:#173a36;color:#caffea;padding:8px 12px;border-radius:8px;font:13px system-ui;pointer-events:none}.lx-copy-notice:empty{display:none}";document.head.append(style);
 let saved="",noticeTimer;
 function report(message){notice.textContent=message;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>notice.textContent="",2600)}
 function close(){menu.hidden=true;saved=""}
 function fallback(text){
  const area=document.createElement("textarea");area.value=text;area.setAttribute("readonly","");area.style.cssText="position:fixed;left:0;top:0;opacity:0;pointer-events:none";
  document.body.append(area);area.select();let ok=false;
  try{ok=document.execCommand("copy")}catch(e){}finally{area.remove();term.focus()}
  return ok;
 }
 async function write(text){
  if(!text)return;
  try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(text);report("已复制选中文字");return}}catch(e){}
  if(fallback(text))report("已复制选中文字");else report("复制失败：浏览器限制剪贴板访问，请尝试在独立实验室页面复制。");
 }
 term.attachCustomKeyEventHandler(event=>{
  if(event.type==="keydown"&&(event.ctrlKey||event.metaKey)&&!event.altKey&&event.key.toLowerCase()==="c"&&term.hasSelection()){
   event.preventDefault();event.stopPropagation();if(!event.repeat)void write(term.getSelection());return false;
  }
  return true;
 });
 // Capture the context menu before xterm's right-click handling can replace selection.
 host.addEventListener("mousedown",event=>{
  if(event.button===2&&term.hasSelection()){saved=term.getSelection();event.preventDefault();event.stopImmediatePropagation()}
 },true);
 host.addEventListener("contextmenu",event=>{
  event.preventDefault();event.stopImmediatePropagation();
  saved=term.hasSelection()?term.getSelection():saved;
  copy.disabled=!saved;menu.hidden=false;
  menu.style.left="0px";menu.style.top="0px";
  const rect=menu.getBoundingClientRect();
  menu.style.left=Math.max(0,Math.min(event.clientX,window.innerWidth-rect.width-4))+"px";
  menu.style.top=Math.max(0,Math.min(event.clientY,window.innerHeight-rect.height-4))+"px";
 },true);
 copy.addEventListener("mousedown",event=>event.preventDefault());
 copy.addEventListener("click",()=>{const text=saved;close();term.focus();void write(text)});
 document.addEventListener("pointerdown",event=>{if(!menu.hidden&&!menu.contains(event.target))close()},true);
 document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!menu.hidden){close();event.preventDefault();event.stopPropagation();term.focus()}},true);
 window.addEventListener("blur",close);
 window.addEventListener("resize",close);
};