import $ from 'jquery';

export default class App{
    constructor(count, container){
        this.count = count;
        this.fields = 'name,email,phone,location,picture';
        this.$container = $('.' + container);
        this.container = document.querySelector('.' + container);
        this.personСlassName = container + '__person';

        this.outputPeople = this.outputPeople.bind(this);
        this.loadPeopleRapi = this.loadPeopleRapi.bind(this);
        this.loadPeopleLocal = this.loadPeopleLocal.bind(this);
        this.clear = this.clear.bind(this);
    }

    clear(){
        let $newMain = $(this.container.cloneNode(false));
        this.$container.replaceWith($newMain);
        this.$container = $newMain;
    }

    loadPeopleRapi(){
        $.ajax({
          url: `https://randomuser.me/api/?results=${this.count}&inc=${this.fields}`,
          dataType: 'json',
          success: (data) => { this.outputPeople(data.results) }
        });
    }

    loadPeopleLocal(){
        let people = [];
        for(let i = 0; i < localStorage.length; i++){
            let key = localStorage.key(i);
            if(/person\d*/.test(key))
                people.push(JSON.parse(localStorage.getItem(key)));
        }
        this.clear();
        this.outputPeople(people);
    }

    resetLocal(){
        localStorage.clear();
    }

    saveInLocal(person){
        person.noSave = true;
        localStorage.setItem('person' + localStorage.length,JSON.stringify(person));
    }

    getPersonId($current){
        let checkClass = (el) => {
            return el.hasClass(this.personСlassName) ? el.attr('data-id') : false;
        }
        return checkClass($current) || checkClass($current.parent());
    }

    fillPersonModal($modal, person){
        function addText(class_extention, text){
            $modal.find('.modal__person-' + class_extention + '-text').html(text);
        }

        addText('name', person.name.first + ' ' + person.name.last);
        addText('email', person.email);
        addText('phone', person.phone);
        addText('location', person.location.city + ', ' + person.location.street);

        return $modal;
    }

    openModal(people){
        return (event) => {
            let id = this.getPersonId($(event.target));
            if(id){
                let person = people[id];
                if(!person.hasOwnProperty('noSave')) person.noSave = false;

                let $modal = $('.modal');
                $modal.addClass('modal__visible');

                this.fillPersonModal($modal, person);

                $('#btn-save_local').off('click.saveLocally');

                let callback = ( person.hasOwnProperty('noSave') && !person.noSave ) ?
                               () => { this.saveInLocal(person) } : () => { alert('Already saved') };

                $('#btn-save_local').on('click.saveLocally',callback);
            }
        }
    }

    createPersonElemet(tag, class_extention){
        let el = $(document.createElement(tag));
        class_extention = class_extention ? (`-${class_extention}`) : '';

        el.addClass(this.personСlassName + (class_extention));
        return el;
    }

    fillPersonCard($person, personData, id){
        let $personCard = $person.clone(true);

        $personCard.attr('data-id',id);

        $personCard.find('.' + this.personСlassName + '-pic')
             .attr('src', personData.picture.medium);

        $personCard.find('.' + this.personСlassName + '-name')
             .html(personData.name.first + ' ' + personData.name.last);

        return $personCard;
    }

    outputPeople(people){
        this.clear();

        let $fragment = $(document.createDocumentFragment());
        let $person = this.createPersonElemet('div');

        $person.append(this.createPersonElemet('img', 'pic'));
        $person.append(this.createPersonElemet('span', 'name'));

        for(let i = 0; i < people.length; i++){
            let $user = this.fillPersonCard($person, people[i], i);

            $fragment.append($user);
        }

        this.$container.on('click',this.openModal(people));
        this.$container.append($fragment)
    }

}
