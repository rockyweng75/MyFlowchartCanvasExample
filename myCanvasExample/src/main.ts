import './style.css'
import { FlowCanvas } from '../lib/flow'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas width="500" height="500" id="canvas"></canvas>
  </div>
`
const dom = document.getElementById('canvas');
const canvas = new FlowCanvas(dom);
await init();
addEventListener("resize", async (event) => {
  canvas.handleResize(event)
});

addEventListener("scroll", async (event) => {
  canvas.handleScroll(event)
});


async function init (){
  let node1 = await canvas.createNode('Rect');
  node1.text = '1'
  let node2 = await canvas.createNode('Rect');
  node2.text = '2'
  
  let node3 = await canvas.createNode('Diamond');
  node3.text = '3'
  
  let node4 = await canvas.createNode('Trapezoidal');
  node4.text = '4'
  
  let node5 = await canvas.createNode('Round');
  node5.text = '5'
  
  let node6 = await canvas.createNode('Ellipse');
  node6.text = '6'
  
  let node7 = await canvas.createNode('Terminator');
  node7.text = '7'
  // canvas.createConnectLine(node1, node2)
  // canvas.createConnectLine(node2, node3)
  // canvas.createConnectLine(node3, node4)
  // canvas.createConnectLine(node4, node5)
  
  canvas.print()
}


// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
