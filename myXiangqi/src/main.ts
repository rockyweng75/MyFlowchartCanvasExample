import './style.css'
import { Action } from '../lib/main'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div>
  <canvas width="500" height="500" id="canvas"></canvas>
</div>
`
const dom = document.getElementById('canvas');
const canvas = new Action(dom as HTMLCanvasElement);
await init();
addEventListener("resize", async (event) => {
  canvas.handleResize(event)
});

addEventListener("scroll", async (event) => {
  canvas.handleScroll(event)
});

async function init (){  
  canvas.init()
  canvas.print()
  canvas.oncommit = (res: object)=>{
    console.log('oncommit', res)
  }
}




