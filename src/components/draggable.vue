<template>
  <div ref="draggableContainer" id="draggable-container" :showOrderWindow="'70'">
    <div id="draggable-header" @mousedown="dragMouseDown" >
      <slot name="header" id="header"></slot>
    </div>
    <slot name="main" id="main"></slot>
    <slot name="footer" id="footer"></slot>
  </div>
</template>

<script>
export default {
  name: "DraggableDiv",
  data: function() {
    return {
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0
      },
    };
  },
  methods: {

    dragMouseDown: function(event) {
      event.preventDefault();
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      document.onmousemove = this.elementDrag;
      document.onmouseup = this.closeDragElement;
    },
    elementDrag: function(event) {
      
      event.preventDefault();
      this.positions.movementX = this.positions.clientX - event.clientX;
      this.positions.movementY = this.positions.clientY - event.clientY;
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;

      var PADDING = 0;

      var viewport = {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
      };
      
      var rect = this.$refs.draggableContainer.getBoundingClientRect();
      viewport.bottom = window.innerHeight - PADDING;
      viewport.left = PADDING;
      viewport.right = window.innerWidth - PADDING;
      viewport.top = PADDING;
      var newLeft = this.$refs.draggableContainer.offsetLeft - this.positions.movementX;
      var newTop = this.$refs.draggableContainer.offsetTop -  this.positions.movementY ;
      
      if (newLeft < viewport.left
        || newTop < viewport.top
        || newLeft + rect.width > viewport.right
        || newTop + rect.height > viewport.bottom
    ) {


    	// the element will hit the boundary, do nothing...
    } else {
   
      // set the element's new position:
      this.$refs.draggableContainer.style.top = this.$refs.draggableContainer.offsetTop -
        this.positions.movementY +
        "px";
      this.$refs.draggableContainer.style.left = this.$refs.draggableContainer.offsetLeft -
        this.positions.movementX +
        "px";
        this.$refs.draggableContainer.style.bottom = 'auto'
    }
    },
    closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
          this.isbottom = false;
          this.isDrag = false
    }
  },
  mounted() {}
};
</script>

<style>
/* draggable div css */
#draggable-container {
  /* left: 64px; */
  /* top:40%; */
  bottom: 0;
  position: absolute;
  z-index: 99;
  height: auto !important;
  overflow-y: auto !important;
   width:550px;
  filter: drop-shadow(3px 3px 8px rgba(0.25, 0.25, 0.5, 0.45)) !important;
  /* transition: all 0.3s; */
}
#draggable-header {
  z-index: 10;
}
[showOrderWindow = '470']{
  left: 470px;
}
[showOrderWindow = '520']{
  left: 520px;
}
[showOrderWindow = '70']{
  left: 70px;
}



/* draggable div css end */
</style>