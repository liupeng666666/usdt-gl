//summernote setting

$(function () {
    //BEGIN EDITOR
    $('#bugsummernote').summernote({
        height: 260,                // set editor height	
        minHeight: 260,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor	
        //focus: true,                 // set focus to editable area after initializing summernote
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'italic', 'underline', 'clear']],
            //['fontname', ['fontname']],
            ['fontsize', ['fontsize']], // Still buggy
            ['color', ['color']],
            ['para', ['paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video', 'hr']],
            ['view', ['codeview']],
            //['help', ['help']]
        ],
    });

});  