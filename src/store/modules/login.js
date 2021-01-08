import { auth, db } from "@/main"
const state = {
    isLoggedIn: false,
    user: null,
    userData: {},
}

const getters = {
    getIsLoggedIn: state => state.isLoggedIn,
    getUser: state => state.user,
    getUserData: state => state.userData,
    getAddress: state => state.userData.address,
}

const actions = {
    async register({ commit }, userCredentials) {
        try {
            let decoded = peselDecode(userCredentials.pesel);
            let user = await auth.createUserWithEmailAndPassword(userCredentials.email, userCredentials.password);
            console.log(`Register: ${user.user.uid}`);
            if (user) {
                commit('setIsLoggedIn', true);
                commit('setUser', user.user);

                const batch = db.batch()

                batch.set(userCredentials.instituteRef.collection('patients').doc(user.user.uid), {
                    pesel: userCredentials.pesel,
                    email: userCredentials.email,
                    fullname: `${userCredentials.name} ${userCredentials.surname}`,
                    name: userCredentials.name,
                    surname: userCredentials.surname,
                    phone: userCredentials.phone,
                    address: userCredentials.address,
                    local_number: userCredentials.local_number === undefined ? null : userCredentials.local_number,
                    birthday: decoded.date,
                    sex: decoded.sex,
                    registered: new Date(),
                    instituteRef: userCredentials.instituteRef,
                    instituteName: userCredentials.instituteName,
                })

                batch.set(db.collection('users').doc(user.user.uid), {
                    email: userCredentials.email,
                    fullname: `${userCredentials.name} ${userCredentials.surname}`,
                    name: userCredentials.name,
                    surname: userCredentials.surname,
                    phone: userCredentials.phone,
                    address: userCredentials.address,
                    local_number: userCredentials.local_number === undefined ? null : userCredentials.local_number,
                    birthday: decoded.date,
                    sex: decoded.sex,
                    registered: new Date(),
                    instituteRef: userCredentials.instituteRef,
                    instituteName: userCredentials.instituteName,
                })

                await batch.commit();

                let tmp = await db.collection('users').doc(user.user.uid).get();
                let userData = tmp.data();
                userData.uid = tmp.id;
                commit('setUserData', userData);
                return true;
            }
        } catch (error) {
            console.log(error.code);
            return false;
        }
        return true;
    },
    async registerDoctor({ commit }, userCredentials) {
        try {
            let decoded = peselDecode(userCredentials.pesel);
            let user = await auth.createUserWithEmailAndPassword(userCredentials.email, userCredentials.password);
            console.log(`Register: ${user.user.uid}`);
            if (user) {
                commit('setIsLoggedIn', true);
                commit('setUser', user.user);

                const batch = db.batch()

                batch.set(userCredentials.instituteRef.collection('doctors').doc(user.user.uid), {
                    pesel: userCredentials.pesel,
                    email: userCredentials.email,
                    fullname: `${userCredentials.name} ${userCredentials.surname}`,
                    name: userCredentials.name,
                    surname: userCredentials.surname,
                    phone: userCredentials.phone,
                    address: userCredentials.address,
                    local_number: userCredentials.local_number === undefined ? null : userCredentials.local_number,
                    birthday: decoded.date,
                    sex: decoded.sex,
                    registered: new Date(),
                    instituteRef: userCredentials.instituteRef,
                    instituteName: userCredentials.instituteName,
                    wardRef: userCredentials.wardRef,
                })

                batch.set(db.collection('users').doc(user.user.uid), {
                    email: userCredentials.email,
                    fullname: `${userCredentials.name} ${userCredentials.surname}`,
                    name: userCredentials.name,
                    surname: userCredentials.surname,
                    phone: userCredentials.phone,
                    address: userCredentials.address,
                    local_number: userCredentials.local_number === undefined ? null : userCredentials.local_number,
                    birthday: decoded.date,
                    sex: decoded.sex,
                    registered: new Date(),
                    instituteRef: userCredentials.instituteRef,
                    instituteName: userCredentials.instituteName,
                    wardRef: userCredentials.wardRef,
                    doctor: true,
                })

                await batch.commit();

                let tmp = await db.collection('users').doc(user.user.uid).get();
                let userData = tmp.data();
                userData.uid = tmp.id;
                commit('setUserData', userData);
                return true;
            }
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
                let tmp = await db.collection('users').doc(user.user.uid).get();
                let userData = tmp.data();
                userData.uid = tmp.id;
                commit('setUserData', userData);
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
    async fetchInstitutesList({dispatch}) {
        try {
            const res = await db.collection('utilities').doc('institutesList').get();
            let institutes = [];
            res.data().list.forEach(element => {
                institutes.push(element)
            });
            return institutes;
        } catch (error) {
            console.error(error)
            dispatch('throwSurveyAlert', {
                text: 'Nie udało się pobrać listy instytucji',
                success: false,
            })
        }
    },
    authStateChanged({ commit, dispatch }) {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                // User is signed in.
                commit('setIsLoggedIn', true);
                commit('setUser', user);
                let tmp = await db.collection('users').doc(user.uid).get();
                let userData = {
                    ...tmp.data(),
                    uid: tmp.id,
                }
                commit('setUserData', userData);
                if (userData.doctor) {
                    dispatch('fetchTreatments');
                    dispatch('fetchPatients');
                    dispatch('fetchDoctors');
                    dispatch('fetchSurveys');
                    dispatch('fetchPatientSurveys');
                    dispatch('fetchAppointments');
                }

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
    setUserData: (state, data) => state.userData = data,
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