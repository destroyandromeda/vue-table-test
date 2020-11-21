<template>
  <div v-if="show" class="modal-shadow" @keydown.esc="closeModal" @click.self="closeModal">
    <div class="modal">
      <div class="modal-close" @click="closeModal">&#10006;</div>
      <slot name="title">
        <h3 class="modal-title"></h3>
      </slot>
      <slot name="body">
        <div class="modal-content">
          <p>Имя :{{ fullname }}</p>
          <p>Адрес : {{ address }}</p>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalWindow",
  data: function () {
    return {
      show: false,
      fullname: '',
      address: '',
    }
  },
  mounted() {
    let self = this;
    window.addEventListener('keyup', function(event) {
      // If  ESC key was pressed...
      if (event.keyCode === 27) {
        self.closeModal()
      }
    });
  },
  methods: {
    closeModal: function () {
      this.show = false
      this.fullname = ''
      this.address = ''
    }
  }
}
</script>

<style scoped
       lang="scss">
.modal-shadow {
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.39);
}

.modal {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  min-width: 420px;
  max-width: 480px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &-close {
    border-radius: 50%;
    color: #fff;
    background: #2a4cc7;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 7px;
    right: 7px;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }

  &-title {
    color: #0971c7;
  }

  &-content {
    margin-bottom: 20px
  }

  &-footer {
    &__button {
      background-color: #0971c7;
      color: #fff;
      border: none;
      text-align: center;
      padding: 8px;
      font-size: 17px;
      font-weight: 500;
      border-radius: 8px;
      min-width: 150px;
    }
  }
}
</style>