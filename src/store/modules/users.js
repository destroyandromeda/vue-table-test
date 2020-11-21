export default {

    state: {
        info: [],
        rows: null,
        page: null,
        status: 'finish',
    },
    mutations: {
        SET_STATUS(state, status) {
            state.status = status
        },
        SET_info(state, info) {
            state.info = info
        }
    },
    actions: {
        async fetchData({commit}) {
            return new Promise(async (resolve, reject) => {
                commit('SET_STATUS', 'loading')
                await fetch(`http://www.filltext.com/?rows=1000&id={index}&fullname={firstName}~{lastName}&company={business}&email={email}&uname={username}&address={addressObject}`)
                    .then((res) => {
                        if (res.status >= 200 && res.status < 300) {
                            return res;
                        } else {
                            let error = new Error(res.statusText);
                            error.response = res;
                            throw error
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        commit('SET_info', data)
                        commit('SET_STATUS', 'finish')
                        resolve(data)
                    })
                    .catch((e) => {
                        console.log('Error: ' + e.message);
                        console.log(e.response);
                        commit('SET_STATUS', 'finish')
                        reject({
                            err: 'Error: ' + e.message,
                            info: e
                        })
                    });

            })
        },
    },
    getters: {
        getStatus(state) {
            return state.status
        }
    }

}