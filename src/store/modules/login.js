import { auth } from "@/main"
const state = {
    isLoggedIn: false,
    user: null,
}

const getters = {
    getIsLoggedIn: state => state.isLoggedIn,
    getUser: state => state.user,
}

const actions = {
    async logIn({ commit }, userData) {
        try {
            let user = await auth.signInWithEmailAndPassword(userData.email, userData.password);
            if (user) {
                commit('setIsLoggedIn', true);
                commit('setUser', user.user);
            }
            else return false;
        } catch (error) {
            console.log(error.code);
            return false;
        }
        return true;
    },
    async logOut({ commit }) {
        await auth.signOut();
        commit('setIsLoggedIn', false);
        commit('setUser', null);
        console.log("logged out");
        return;
    },
    authStateChanged({ commit }) {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                // User is signed in.
                commit('setIsLoggedIn', true);
                commit('setUser', user);

                /*var email = user.email;
                var uid = user.uid;
                var displayName = user.displayName;
                var emailVerified = user.emailVerified;
                var providerData = user.providerData;*/
            } else {
                // User is signed out.
                console.log("User signed out");
                commit('setIsLoggedIn', false);
                commit('setUser', null);
            }
        });
    },
}

const mutations = {
    setIsLoggedIn: (state, data) => state.isLoggedIn = data,
    setUser: (state, data) => state.user = data,
}

export default {
    state,
    getters,
    actions,
    mutations,
}