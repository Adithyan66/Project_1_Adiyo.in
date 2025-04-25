


// export const captureReferral = () => {
//     const params = new URLSearchParams(window.location.search);
//     const code = params.get('join');
//     if (code) {
//         localStorage.setItem('referralCode', code);
//     }
// };


export const captureReferral = () => {

    const [, slug, code] = window.location.pathname.split('/');

    if (slug === 'join' && code) {
        localStorage.setItem('referralCode', code);
    }
};
