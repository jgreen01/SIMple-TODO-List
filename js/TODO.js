$(document).ready(function() {

    /**
     * CurrentList Object - manages all todo list data.
     */
    var currentList = (function () {
        var lists;
        var selectedList;

        if (!currentList){
            lists = {
                work: [
                    {msg:'debug the ui bug code', date:'2014-11-3', priority: 'low', id: 1},
                    {msg:'create database service', date:'2014-10-5', priority: 'med', id:2},
                    {msg:'demand requirements from client', date:'2014-9-25', priority: 'high', id:3}
                ],
                home: [
                    {msg:'wash whiskers', date:'Tomorrow', priority: 'high', id: 1},
                    {msg:'find new sofa', date:'2014-9-12', priority: 'low', id: 2},
                    {msg:'play video games', date:'Today', priority: 'med', id: 3}
                ],
                vacation: [
                    {msg:'go to chinatown', date:'2015-5-24', priority: 'med', id: 1},
                    {msg:'visit the field museum', date:'2015-5-25', priority: 'low', id: 2},
                    {msg:'visit millennium park', date:'2015-5-25', priority: 'high', id: 3}
                ]
            };
        }
        else {
            lists = currentList.getLists();
        }

        return {
            /**
             * Sets the current selected list.
             * @param selectedList
             */
            setSelectedList: function (listName){
                this.selectedList = String(listName);
            },
            /**
             * Gets either the current selected list or the list of your choosing.
             * @param name OPTIONAL if not provided it will return the current selected list
             * @returns {*}
             */
            getList: function (name){
                if(!name) {
                    return this.lists[this.selectedList];
                } else {
                    return this.lists[name];
                }
            },
            /**
             * Creates and adds a new item to the list.
             * @param msg
             * @param date
             * @param priority
             */
            addItem: function (msg, date, priority){
                obj = {msg: msg, date: date, priority: priority, id: _.uniqueId('todo')};
                lists[selectedList].push(obj);
            },
            /**
             * Returns all lists in an object (associative array).
             * @returns {*}
             */
            getLists: function (){
                return this.lists;
            },
            /**
             * Adds an empty list to the lists object.
             * @param name name of the new list
             */
            addList: function (name){
                this.lists[name] = [];
            },
            /**
             * Removes an item from the current selected list or the list of your choosing.
             * @param arr
             * @param name OPTIONAL if not provided the item will be remvoed from the current selected list
             */
            removeItem: function (arr, name){
                if(!name) {
                    lists[selectedList] = _.without(lists[selectedList], arr);
                } else {
                    lists[name] = _.without(lists[name], arr);
                }
            }
        }
    }());

    $('#todoPanel').on('click', '#addTodoBtn', function () {
        var todo = $('#newTodoBox').val();
        var dueDate = $('#todoDate').val();

        if (validateTodo(currentList.get(), todo, dueDate)) {
            $('#listOfTodos').prepend(createTodoHtml(todo, dueDate));

            currentList.addItem(todo, dueDate);

            $('#newTodoBox').val('');
            $('#todoDate').val('');
        }
    });

    /**
     * Checks if you put the right stuff in the boxes
     * @param list
     * @param todo
     * @param dueDate
     * @returns {boolean}
     */
    function validateTodo(list, todo, dueDate) {

        for (i = 0; i < list.length; i++) {
            if (list[i][0] == todo) {
                console.log("Already on list.");
                return false;
            }
            if (Date.parse(dueDate) < Date.now()) {
                console.log("Past date.");
                return false;
            }
        }

        return true;
    }

    $('#todoPanel').on('click', '.item', function () {
        $(this).closest('.TodoItem').toggleClass("CompletedItem");

    });

    $('#listPanel').on('click', 'li', function () {

        var selectedList = $(this).text();

        currentList.setSelectedList(selectedList);

        removeListHighlighting();
        $(this).toggleClass("HighlightItem");
        displayList(currentList.getList());
    });

    /**
     * Creates the div's with all the classes, id's, and data they need
     * @param msg TODO message
     * @param dueDate time TODO is due
     * @param priority how important is it
     * @param id id of
     * @returns {*|jQuery}
     */
    function createTodoHtml(msg, dueDate, priority, id) {

        priorityclass = (function (){
           switch (priority) {
               case 'low':
                   return "bg-success";
               case 'med':
                   return "bg-warning";
               case 'high':
                   return "bg-danger";
           }
        }());

        return $('<div></div>').val($('<input>').attr('type','checkbox') + msg)
            .addClass('TodoItem ' + priorityclass).attr('id', id)
            .append($('<div></div>').val(dueDate).addClass('DueDate'));
//        return '<div class="TodoItem ' + priority '" id="' + id '"> <input class="item" type="checkbox" />' + todo
//            + '<div class="DueDate">' + dueDate + '</div></div>';
    }

    /**
     * Reads the whole list and puts it on the page.
     * @param list TODO list
     */
    function displayList(list) {
        $('#listOfTodos').empty();
        for (i = 0; i < list.length; i++) {
            $('#listOfTodos').prepend(
                createTodoHtml(list[i].msg, list[i].date, list[i].priority, list[i].id));
        }
    }

    /**
     * Removes highlighting from all lists
     */
    function removeListHighlighting() {
        $('#listPanel li').each(function () {
            $(this).removeClass("HighlightItem");
        });
    }

});
