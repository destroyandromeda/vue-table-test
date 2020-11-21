<template>
  <div class="hello">
    <button @click="loadData">Загрузить список</button>
    <CustomTable :thToTd="mask" :allInfo="info" :rows="10" :status="status"/>
  </div>
</template>

<script>
import CustomTable from '@/components/CustomTable'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'HelloWorld',
  components: {CustomTable},
  data() {
    return {
      info: null,
      mask: {
        // "id": 'id',
        "fullname": 'fullname',
        "uname": 'uname',
        "company": 'company',
        "email": 'email',
        // "streetAddress": 'address.streetAddress',
        // "city": 'address.city',
        "state": 'address.state',
        // "zip": 'address.zip'
      },
      status: 'pure'
    }
  },

  methods: {
    ...mapActions(['fetchData']),
    async loadData() {
      if (!this.info) {
        this.status = 'load'
        this.info = await this.fetchData()
            .then(res => {
              this.status = 'ok'
              return res
            })
            .catch(err => {
              this.status = 'error'
              return err
            })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello {
  text-align: center;
  width: 100%
}
</style>
