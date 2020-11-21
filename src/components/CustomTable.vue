<template>
  <div class="main" v-if="process !== 'pure'">
    <form action="#" v-if="process === 'ok'" @submit.prevent="filterByKey">
      <div class="filter">
        <div v-for="key in ths" :key="key.id" class="form_grup">
          <label :class="filter[thToTd[key]] && filter[thToTd[key]].length > 0 ? 'form_label_active' : 'form_label'"
                 :for="'input'+key">{{
              key
            }}</label>
          <input class="form_input" :id="'input'+key" type="text" v-model="filter[thToTd[key]]"
                 placeholder="">
        </div>
        <button class="form_button" type="submit">Поиск</button>
      </div>
    </form>
    <div class="table-wrap" v-if="process === 'ok'">

      <div class="myTable" v-if="allData.length > 0">
        <table>
          <thead>
          <tr>
            <th v-for="key in ths" :key="key.id" @click="sortBy(thToTd[key])">
              {{ key }} {{ sortedFlags.get(thToTd[key]) ? '&#8593;' : '&#8595;' }}
            </th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="elem in info" :key="elem.id" @click="showModal(elem.id)">
            <td :data-label="key" v-for="key in ths">{{ getValue(elem, thToTd[key]) }}</td>
          </tr>
          </tbody>

        </table>
      </div>
      <div v-else>
        Данных нет
      </div>

      <div v-if="allData.length > 0" class="paginator">
        <span v-if="pageNumber > seePages" @click="toStart"> << </span>
        <span v-if="pageNumber > 1" @click="prevPage"> < </span>
        <span v-for="page in pages" :key="page" v-if="pageNumber + seePages > page && pageNumber - seePages < page"
              @click="toPage(page)">
          <span v-if="pageNumber === page"><input type="number" min="1" :max="pages"
                                                  @input="update($event.target.value)"
                                                  v-model.number="pageNumber"></span>
          <span v-else>{{ page }}</span>
        </span>
        <span @click="nextPage" v-if="pageNumber < pages"> > </span>
        <span v-if="pageNumber <= pages - seePages" @click="toEnd"> >> </span>
      </div>


    </div>
    <div class="loader" v-if="process === 'load'">
      loading...
    </div>
    <div class="error" v-if="process === 'error'">
      {{ info.err }}
    </div>

    <ModalWindow ref="modal"/>

  </div>
</template>

<script>
import ModalWindow from "@/components/ModalWindow";

export default {
  name: "CustomTable",
  components: {ModalWindow},
  props: {
    status: {
      type: String,
      required: true
    },
    thToTd: {
      type: Object,
      required: true
    },
    allInfo: {
      required: true
    },
    rows: {
      type: Number,
    }
  },
  data() {
    return {
      ths: [],
      process: this.status,
      seePages: 3,
      pageNumber: 1,
      info: [],
      allData: [],
      atPage: this.rows ?? 10,
      pages: 1,
      sortedFlags: new Map(),
      filter: {}
    }
  },

  methods: {

    filterByKey() {
      this.process = 'load'

      this.check()
      const filteredData = []
      if (Object.keys(this.filter).length > 0) {
        // console.log(Object.keys(this.filter))
        Object.keys(this.filter).map(filterBy => {
          this.allData.map(info => {
            if (this.getValue(info, filterBy) === this.filter[filterBy]) {
              filteredData.push(info)
            }
          })
        })
        this.allData = filteredData

      } else {
        this.allData = this.allInfo.map(el => el)
      }
      this.pages = this.countPages()
      this.info = this.slicer()
    },
    sortBy(key) {
      this.process = 'load'

      if (this.sortedFlags.get(key)) {
        this.allData.sort((a, b) => this.getValue(a, key) > this.getValue(b, key) ? 1 : -1)
        this.info = this.slicer()
      } else {
        this.allData.sort((a, b) => this.getValue(a, key) < this.getValue(b, key) ? 1 : -1)
        this.info = this.slicer()
      }
      this.sortedFlags.set(key, !this.sortedFlags.get(key))
    },

    countPages() {
      return this.allData.length > 0 ? Math.ceil(this.allData.length / this.rows) : 1
    },
    check() {
      let isEmpty = true
      Object.keys(this.filter).map(key => {
        if (this.filter[key].length > 0) {
          isEmpty = false
        }
      })
      if (isEmpty) {
        this.filter = {}
      }
    },
    slicer() {
      const start = this.pageNumber > 1 ? this.pageNumber * this.atPage - this.atPage : 0
      const end = this.pageNumber > 1 ? start + this.atPage : this.atPage;
      this.process = "ok"
      return this.allData.slice(start, end)
    },
    loadInfo() {
      this.info = this.slicer()
    },
    firstLoad() {
      this.process = 'load'

      this.allData = this.allInfo.map(el => el)
      this.pages = this.countPages()
      this.ths = Object.keys(this.$props.thToTd)
      this.ths.map(key => {
        this.sortedFlags.set(key, false)
      })
      this.info = this.slicer()
    },
    updateStatus(val) {
      this.process = val
    },
    update(val) {
      if (val > this.pages) {
        this.pageNumber = this.pages
      }
      if (val < 0) {
        this.pageNumber = 1
      }
      if (!val) {
        this.pageNumber = 1

      }
    },
    getValue(obj, key) {
      let keySplit = key.split('.');
      if (keySplit.length > 1) {
        return this.getValue(obj[keySplit[0]], keySplit.slice(1, keySplit.length).join("."));
      }
      if (keySplit.length === 1) {
        return obj[key];
      } else {
        return obj;
      }
    },

    toEnd() {
      this.pageNumber = this.pages
    },
    toStart() {
      this.pageNumber = 1
    },
    async nextPage() {
      this.pageNumber++
    },
    async prevPage() {
      if (this.pageNumber > 1)
        this.pageNumber--
      else {
        this.pageNumber = this.$props.pages
      }
    },
    async toPage(page) {
      this.pageNumber = page
    },

    showModal(id) {
      console.log(id)
      const data = this.info.filter(el => el.id === id)[0]
      console.log(data)

      this.$refs.modal.show = true
      this.$refs.modal.fullname = data.fullname
      this.$refs.modal.address = data.address.streetAddress
    },
    closeModal() {
      this.isModalVisible = false;
    },
  }
  ,
  watch: {
    status: 'updateStatus',
    pageNumber
:
'loadInfo',
    allInfo
:
'firstLoad'
}
}
</script>

<style scoped>

tr {
  cursor: pointer;
}

.filter {
  text-align: center;
  padding: 10px;
  width: 50%;
  margin: auto;
  margin-top: 20px;

}

.form_grup {
  position: relative;
  margin-bottom: 32px;
}

.form_input {
  width: 100%;
  padding: 0 0 10px 0;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  background-color: transparent;
  outline: none;
  transition: 0.3s;
}

.form_label {
  position: absolute;
  top: 0;
  z-index: -1;
  color: #9e9e9e;
  transition: 0.3s;
}

.form_button:focus,
.form_button:hover {
  background-color: rgba(0, 113, 240, 0.7);
}

.form_button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-family: sans-serif;
  letter-spacing: 1px;
  font-size: 16px;
  color: #fff;
  background-color: #0071f0;
  outline: none;
  cursor: pointer;
  transition: 0.3s;
}

.form_input:focus {
  border-bottom: 1px solid #1a73a8;
}

.form_label_active {
  top: -18px;
  color: #e0e0e0;
  position: absolute;
  z-index: -1;
}

.myTable {
  height: 70vh;
  overflow: auto;
}

span {
  padding: 2px;
  cursor: pointer;
  font-size: 20px;
}

th {
  cursor: pointer;
}

.table-wrap {

  text-align: center;
  display: inline-block;
  background-color: #fff;
  color: #000;
}

table {
  border: 1px solid #ccc;
  width: 100%;
  margin: 0;
  padding: 0;
  border-collapse: collapse;
  border-spacing: 0;
}

table tr {
  border: 1px solid #ddd;
  padding: 2px;
}

table th, table td {
  padding: 10px;
  text-align: center;
  border-right: 1px solid #ddd;
}

table th {
  color: #fff;
  background-color: #444;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 1px;
}

@media screen and (max-width: 800px) {
  .filter {
    width: 80%;
  }

  table {
    border: 0;
    width: 80vw;
  }

  table thead {
    display: none;
  }

  table tr {
    margin-bottom: 10px;
    display: block;
    border-bottom: 2px solid #ddd;
  }

  table td {
    display: block;
    text-align: right;
    font-size: 13px;
    border-bottom: 1px dotted #ccc;
    border-right: 1px solid transparent;
  }

  table td:last-child {
    border-bottom: 0;
  }

  table td:before {
    content: attr(data-label);
    float: left;
    text-transform: uppercase;
    font-weight: bold;
  }
}
</style>