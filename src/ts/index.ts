class Point {
  public x: number;
  public y: number;

  /**
   * Point class
   * @param x The x coordinate
   * @param y The y coordinate
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Draw the point
   * @param ctx The canvas context
   * @param prevPoint The previous point
   */
  draw(ctx: CanvasRenderingContext2D, prevPoint?: Point) {
    if (!prevPoint) return;

    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
  }

  /**
   * Update the point
   */
  update() {
    this.x -= 1;
  }
}

const canvas: HTMLCanvasElement = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');

let sy: number = 0;
let velocity: number = 0;

const points: Point[] = [];

/**
 * Linear interpolation function
 * @param start The start value
 * @param end The end value
 * @param t The time value
 * @returns A number
 */
const lerp = (start: number, end: number, t: number): number => {
  return start * (1 - t) + end * t;
};

/**
 * Update teh canvas size
 */
const resize = () => {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
};

/**
 * Update the canvas
 */
const update = () => {
  sy = lerp(sy, 0, 0.05);
  velocity = lerp(velocity, sy, 0.1);

  // If the amount of points is greater than the number of pixels in the window width, remove the first point
  if (points.length >= window.innerWidth) {
    points.shift();
  }

  // Add a new point representing the velocity
  points.push(new Point(window.innerWidth, window.innerHeight / 2 + velocity));

  // For each point, call the update method and remove the point if it's out of the canvas
  for (const point of points) {
    point.update();

    // Remove point if out of bounds
    if (point.x < 0 || point.x > window.innerWidth || point.y < 0 || point.y > window.innerHeight) {
      const index = points.indexOf(point);
      points.splice(index, 1);
    }
  }
};

/**
 * Draw the canvas
 */
const draw = () => {
  // Fill the canvas
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Update the canvas
  update();

  // For each point, call the draw method
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const prevPoint = points[i - 1];

    point.draw(ctx, prevPoint);
  }

  window.requestAnimationFrame(draw);
};

/**
 * On scroll event handler
 * @param event The wheel event
 */
const onScroll = (event: WheelEvent) => {
  sy += event.deltaY / 10;
};

(async () => {
  resize();

  // Default points
  for (let i = 0; i < window.innerWidth; i++) {
    points.push(new Point(i, window.innerHeight / 2));
  }

  // Draw functino
  window.requestAnimationFrame(draw);

  // Event handlers
  window.addEventListener('resize', resize);
  window.addEventListener('wheel', onScroll);
})();
