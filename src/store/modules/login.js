import { auth, db } from "@/main"
const state = {
    isLoggedIn: false,
    user: null,
}

const getters = {
    getIsLoggedIn: state => state.isLoggedIn,
    getUser: state => state.user,
}

const actions = {
    async register({ commit }, userCredentials) {
        try {
            let decoded = peselDecode(userCredentials.pesel);
            let user = await auth.createUserWithEmailAndPassword(userCredentials.email, userCredentials.password);
            sleep(5000);
            if (user) {
                commit('setIsLoggedIn', true);
                commit('setUser', user.user);
                await db.collection('patients').doc(user.user.uid).update({
                    fullname: `${userCredentials.name} ${userCredentials.surname}`,
                    name: userCredentials.name,
                    surname: userCredentials.surname,
                    phone: userCredentials.phone,
                    address: userCredentials.address,
                    local_number: userCredentials.local_number,
                    birthday: decoded.date,
                    sex: decoded.sex,
                    registered: new Date(),
                });
            }
            else return false;
        } catch (error) {
            console.log(error.code);
            return false;
        }
        return true;
    },
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

function peselDecode(pesel) {
    // http://artpi.pl/?p=8
    // Funkcja dekodujaca nr. Pesel 
    // Wycinamy daty z numeru
    let rok = parseInt(pesel.substring(0, 2), 10);
    let miesiac = parseInt(pesel.substring(2, 4), 10) - 1;
    let dzien = parseInt(pesel.substring(4, 6), 10);
    // Powszechnie uwaza sie, iz daty w numerach pesel obejmuja tylko ludzi urodzonych do 2000 roku. Na szczescie prawodawcy o tym pomysleli i do miesiaca dodawane sa liczby tak, by pesele starczyly az do 23 wieku. 
    if (miesiac > 80) {
        rok = rok + 1800;
        miesiac = miesiac - 80;
    }
    else if (miesiac > 60) {
        rok = rok + 2200;
        miesiac = miesiac - 60;
    }
    else if (miesiac > 40) {
        rok = rok + 2100;
        miesiac = miesiac - 40;
    }
    else if (miesiac > 20) {
        rok = rok + 2000;
        miesiac = miesiac - 20;
    }
    else {
        rok += 1900;
    }
    // Daty sa ok. Teraz ustawiamy.
    let urodzony = new Date();
    urodzony.setFullYear(rok, miesiac, dzien);

    // Teraz zweryfikujemy numer pesel
    // Metoda z wagami jest w sumie najszybsza do weryfikacji.

    //plec
    let sex
    if (parseInt(pesel.substring(9, 10), 10) % 2 === 1) {
        sex = 'm';
    } else {
        sex = 'k';
    }
    return { sex: sex, date: urodzony };
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
} 