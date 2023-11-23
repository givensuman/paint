<script>
	//@ts-ignore
	import TiledCanvas from '../lib/TiledCanvas.js';

	import { browser } from '$app/environment';

	if (browser) {
		let ctx = new TiledCanvas(document.getElementById('targetcanvas'));
		ctx.context.normalMethod();
		ctx.beginPath();
		ctx.moveTo(5, 5);
		ctx.lineTo(15, 15);
		ctx.stroke();
	}
</script>

<canvas id="whiteboard"></canvas>
