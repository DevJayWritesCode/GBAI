import swal from 'sweetalert';

export const setAlert = (title: string, message: string) => {
    swal({
        title: title,
        text: message
    }).then(
        function () { },
        function (dismiss) {
            if (dismiss === 'timer') { }
        });
}

export const closeAlert = () => {
    swal.close && swal.close();
}
