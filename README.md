# vue-putty
Drag events Vue.js style. Touch compatible.

```javascript
// Functional Vue.js
h(putty, {
  attrs: {
    // controls the element that receives mouse / touch events.
    className: 'putty',
    tagName: 'div'
  },
  on: {
    start: start => {
      // A selection starts
      // start == [x, y]
    },
    move: ({ start, current, delta }) => {
      // The selection continues
      // start == [x, y]
      // current == [x, y]
      // delta == [dx, dy]
    },
    end: ({ start, end, delta }) => {
      // The selection has finished
      // start == [x, y]
      // end == [x, y]
      // delta == [dx, dy]
    },
    tap: tap => {
      // A mouse click or tap (with no selection)
      // tap == [x, y]
    },
    hover: hover => {
      // The mouse is moving across the element
      // hover == [x, y]
    },
    leave: () => {
      // The mouse has left the element
    }
  }
})
```

```vue
<!-- .vue file -->
<div id="app">
  <putty
    tagName="div"
    className="putty"
    @start="start"
    @move="move"
    @end="end"
    @tap="tap"
    @hover="hover"
    @leave="leave"
  ></putty>
</div>

<script>
var app = new Vue({
  el: '#app',
  methods: {
    start(start) {
      // A selection starts
      // start == [x, y]
    },
    move({ start, current, delta }) {
      // The selection continues
      // start == [x, y]
      // current == [x, y]
      // delta == [dx, dy]
    },
    end({ start, end, delta }) {
      // The selection has finished
      // start == [x, y]
      // end == [x, y]
      // delta == [dx, dy]
    },
    tap(tap) {
      // A mouse click or tap (with no selection)
      // tap == [x, y]
    },
    hover(hover) {
      // The mouse is moving across the element
      // hover == [x, y]
    },
    leave() {
      // The mouse has left the element
    }
  }
})
</script>
````
