$(document).ready(function () {
    $("#repopulateModal").modal({ backdrop: "static", keyboard: false });

    $("#btnRepopulateDb").click(repopulateDb);

    $("#btnDontRepopulateDb").click(loadUsers);

    $("#repopulateModal").modal("show");

    $("#btnSaveTodo").click(createTodo);

    $("#createTodoModal").on("hidden.bs.modal", cleanCreateTodoModal);

    $("#btnSavePost").click(createPost);

    $("#createPostModal").on("hidden.bs.modal", cleanCreatePostModal);
});

function repopulateDb() {
    $("#repopulateModal").modal("hide");
    $("#pageTitle").text("Repopulating db...").addClass("fa-flip");
    $.ajax({
        url: "Home/RepopulateDb",
        type: "POST",
        success: function () {
            showAlert("dB has been repopulated!", true);
            loadUsers();
        },
        error: function (eeee) {
            showAlert("There was an error while repopulating dB! ;(");
        }
    });
}

function loadUsers() {
    $("#pageTitle").text("Downloading...").addClass("fa-flip");
    $(".cloud").addClass("invisible");
    $.ajax({
        url: 'Home/GetUsers',
        type: "GET",
        success: function (result) {
            //Create user HTML body
            $(result).each(function () {
                $("#userList").append(createUserBody(this));
            });
            $("#pageTitle").text("Welcome to the party!").removeClass("fa-flip");
            $(".cloud").removeClass("invisible");
            $("#userList").accordion({ heightStyle: "content" });
            $("#userList").accordion("refresh");

            //Delete icon show/hide handlers
            $(".overlay-parent").mouseenter(function () {
                $(this).find(".delete-overlay").show();
            });
            $(".overlay-parent").mouseleave(function () {
                $(this).find(".delete-overlay").hide();
            });

            //Delete picture handler
            $(".overlay-parent").click(deletePicture);

            //Edit user's name handler
            $("input[field='name'").on("input", function () {
                let parent = $(this).closest(".user-body");
                let id = $(parent).attr("userid");
                $(".user-name-header[userid='" + id + "'").text($(this).val());
            });

            //To-do and post creation handlers
            $("#btnCreateTodo").click(function () {
                let parent = $(this).closest(".user-body");
                let id = $(parent).attr("userid");
                $("#createTodoModal").attr("userid", id).modal("show");
            });
            $("#btnCreatePost").click(function () {
                let parent = $(this).closest(".user-body");
                let id = $(parent).attr("userid");
                $("#createPostModal").attr("userid", id).modal("show");
            });
        },
        error: function () {
            $("#userList").html("No data.");
            showAlert("There was an error when loading data! ;(", false);
        }
    });
}

function createTodo() {
    let todo = {};
    todo.userId = $("#createTodoModal").attr("userid");
    todo.title = $("#inputTodoTitle").val();
    todo.completed = $("#inputTodoCompleted").prop("checked");
    $("#createTodoModal").modal("hide");

    $.ajax({
        url: "Home/CreateTodo",
        type: "POST",
        data: todo,
        success: function (id) {
            todo.id = id;
            addTodo(todo);
            showAlert("To-do created", true);
            cleanCreateTodoModal();
            scrollDownDiv("todosSection");
        },
        error: function () {
            showAlert("There was an error while creating to-do! ;)", false);
        }
    });
}

function addTodo(todo) {
    let completed = todo.completed ? "<i class='fa-solid fa-square-check'></i>" : "<i class='fa-solid fa-circle-xmark'></i>";
    $("#tableTodos tbody").append("<tr class='todo-body' todoid='" + todo.id + "'><td>\u2022 " + todo.title + "</td>" +
        "<td class='text-center'>" + completed + "</td>" +
        "<td class='text-center' onclick='deleteTodo(this)'><img src='./images/delete-icon.png'></img></td></tr>");
}

function cleanCreateTodoModal() {
    $("#createTodoModal").removeAttr("userid");
    $("#inputTodoTitle").val("");
    $("#inputTodoCompleted").prop("checked", false);
}

function createPost() {
    let post = {};
    post.userId = $("#createPostModal").attr("userid");
    post.title = $("#inputPostTitle").val();
    post.body = $("#inputPostBody").val();
    $("#createPostModal").modal("hide");

    $.ajax({
        url: "Home/CreatePost",
        type: "POST",
        data: post,
        success: function () {
            addPost(post);
            showAlert("Post created", true);
            cleanCreatePostModal();
            scrollDownDiv("postsSection");
        },
        error: function () {
            showAlert("There was an error while creating post! ;)", false);
        }
    });
}

function addPost(post) {
    $("#tablePosts tbody").append("<tr><td>" + post.title + "</td><td></td><td>" + post.body + "</td></tr>");
}

function cleanCreatePostModal() {
    $("#createPostModal").removeAttr("userid");
    $("#inputPostTitle").val("");
    $("#inputPostBody").val("");
}

function scrollDownDiv(id) {
    $("#" + id).animate({ scrollTop: $("#" + id).prop("scrollHeight") }, 1000);
}

function deletePicture() {
    let id = $(this).attr("picid");
    $(".overlay-parent[picid='" + id + "']").remove();
}

function createUserBody(user) {
    return "<h6 class='user-body user-name-header' userid='" + user.id + "'>" + user.name + "</h6>" +
        "<div class='user-body' userid='" + user.id + "'>" +
        "<label class='fw-bold'>Name:&nbsp;</label>" +
        "<input field='name' value='" + user.name + "'></input>" +
        "&nbsp;&nbsp;" +
        "<label class='fw-bold'>Username:&nbsp;</label>" +
        "<input field='username' value='" + user.username + "'></input>" +
        "&nbsp;&nbsp;" +
        "<label class='fw-bold'>Email:&nbsp;</label>" +
        "<input field='email' value='" + user.email + "'></input>" +
        "&nbsp;&nbsp;" +
        "<button class='btn btn-primary' onclick='updateUser(this)'>Save</button>" +
        "&nbsp;" +
        "<button class='btn btn-primary' onclick='deleteUser(this)'>Delete</button>" +
        createTodosPostsBody(user) +
        createGalleryBody(user) +
        "</div>";
}

function createGalleryBody(user) {
    let html = "<div class='col-12 text-center mt-2'><h5 class='fw-bold mb-0 pt-1'>Pictures</h5></div>" +
        "<div userid='" + user.id + "' class='col-12 text-start'>";
    $.ajax({
        url: "Home/GetRandomPictures",
        type: "GET",
        async: false,
        success: function (pictures) {
            $(pictures).each(function () {
                html += "<div picid='" + this.id + "' class='d-inline overlay-parent me-1' style='position:relative'>" +
                    "<img height='120px' width='120px' src='" + this.thumbnailUrl + ".png'></img>" +
                    "<img height='24px' width='24px' src='./images/delete-icon.png' class='delete-overlay'></img>" +
                    "</div>";
            });
        }
    });

    html += "</div>";
    return html;
}

function createTodosPostsBody(user) {
    //Create to-do table
    let html = "<div class='container mt-1'>" +
        "<div class='row'>" +
        "<div class='col-6 text-white pt-1 text-end pe-0'>" +
        "<label id='btnCreateTodo' class='btn-add mt-0 text-black'>" +
        "<i class=' fa-solid fa-plus fa-beat'></i> Create to-do</label></div>" +
        "<div class='col-6 text-white pt-1 text-end pe-0'>" +
        "<label id='btnCreatePost' class='btn-add mt-0 text-black'>" +
        "<i class=' fa-solid fa-plus fa-beat'></i> Create post</label></div>" +
        "<div class='col-6 rounded text-white pt-1 section-title mt-1'>" +
        "<h5 class='fw-bold'>To-dos</h5></div>" +
        "<div class='col-6 rounded text-white pt-1 section-title mt-1'>" +
        "<h5 class='fw-bold'>Posts</h5></h5></div>" +
        "<div id='todosSection' class='col-6 section'>" +
        "<table id='tableTodos' class='text-start'><thead class='text-center'><tr>" +
        "<th class='pt-2' style='width:60%;'>Title</th><th style='width:30%;'>Completed</th><th>Delete</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>";

        //Add each to-do
    $(user.todos).each(function () {
        let completed = this.completed ? "<i class='fa-solid fa-square-check'></i>" : "<i class='fa-solid fa-circle-xmark'></i>";
        html += "<tr class='todo-body' todoid='" + this.id + "'>" +
            "<td>\u2022 " + this.title + "</td>" +
            "<td class='text-center'>" + completed + "</td>" +
            "<td class='text-center' onclick='deleteTodo(this)'><img src='./images/delete-icon.png'></img></td>" +
            "</tr>";
    });

    //Create post table
    html += "</tbody></table>" +
        "</div>" +
        "<div id='postsSection' class='col-6 section'>" +
        "<table id='tablePosts' class='text-start'>" +
        "<thead class='text-center'>" +
        "<tr>" +
        "<th class='pt-2'>Title</th><th class='pt-2'>Body</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>";

        //Add each post
    $(user.posts).each(function () {
        html += "<tr>" +
            "<td>" + this.title + "</td>" +
            "<td>" + this.body + "</td>" +
            "</tr>";
    });
    html += "</tbody>" +
        "</table>" +
        "</div>";

    return html;
}

function deleteUser(btn) {
    if (confirm("Are you sure you want to delete this user?")) {
        let id = $(btn).parent().attr("userid");
        $.ajax({
            url: 'Home/DeleteUser/' + id,
            type: "DELETE",
            success: function () {
                $(".user-body[userid='" + id + "']").remove();
                $(".user-body").first().trigger("click");
                showAlert("User was deleted!", true);
            },
            error: function () {
                showAlert("There was an error while deleting user! ;)", false);
            }
        });
    }
}

function deleteTodo(todo) {
    let id = $(todo).closest(".todo-body").attr("todoid");
    $.ajax({
        url: 'Home/DeleteTodo/' + id,
        type: "DELETE",
        success: function () {
            $(".todo-body[todoid='" + id + "']").remove();
            showAlert("To-do was deleted!", true);
        },
        error: function () {
            showAlert("There was an error while deleting to-do! ;)", false);
        }
    });
}

function updateUser(btn) {
    let div = $(btn).parent();
    let user = {};
    user.id = div.attr("userid");
    user.name = $(div).find("input[field='name']").val();
    user.username = $(div).find("input[field='username']").val();
    user.email = $(div).find("input[field='email']").val();

    $.ajax({
        url: 'Home/UpdateUser',
        type: "PUT",
        data: user,
        success: function () {
            showAlert("User was saved!", true);
        },
        error: function () {
            showAlert("There was an error while updating user! ;)", false);
        }
    });
}

function showAlert(text, success) {
    if (success) {
        $("#alertStrip strong").text("Success!");
        $("#alertStrip label").text(text);
        $("#alertStrip").removeClass("alert-danger").addClass("alert-success");
    }
    else {
        $("#alertStrip strong").text("Oh no!");
        $("#alertStrip label").text(text);
        $("#alertStrip").removeClass("alert-success").addClass("alert-danger");
    }
    $("#alertStrip").css("opacity", 1).css("display", "block");
    $("#alertStrip").delay(2000).fadeTo(1000, 0);
}