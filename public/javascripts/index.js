$(document).ready(() => {
    console.log($);
    $("#submit").click(async () => {
        const url = $("#url").val();
        $.post("/api/v2/generate", {
            url: url
        }, data => {
            console.log(data);
            $("#links").append(`
            <div class="link" id="${data.uniq}">
                <div id="${data.uniq}-url"><a href="${data.url}">${data.url}</a></div>
                <div id="${data.uniq}-reallink"><a href="${url}">${url}</a></div>
            </div>
            <br>`); 
        });
    });
});
