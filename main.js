const app = Vue.createApp({
  created(){
    this.getData();
  },

  data(){
    return{
      filter: '',
      buffetsList: [],
      buffetDetails: {show: false, name: '', phone: '', email: '', address: '', district: '',
        state: '', city: '', paymentMethod: '', description: '', rating: ''
      },
      eventsList: [],
      eventDate: '',
      eventGuests: '',
      eventAvailabilityStatus: null,
      eventAvailabilityData: ''
    }
  },

  computed:{
    resultList(){
      if(this.filter){
        return this.buffetsList.filter(buffet => {
          return buffet.name.toLowerCase().includes(this.filter.toLowerCase());
        });
      } else {
        return this.buffetsList;
      }
    }
  },

  methods:{
    async getData(){
      let response = await fetch('http://localhost:3000/api/v1/buffets');

      let data = await response.json();

      data.forEach(item => {
        let buffet = new Object();
        buffet.id = item.id;
        buffet.name = item.name;

        this.buffetsList.push(buffet)
      });
    },

    async showBuffetDetails(index){
      let response = await fetch(`http://localhost:3000/api/v1/buffets/${index}`);

      let data = await response.json();

      this.buffetDetails.show = true;
      this.buffetDetails.name = data.name;
      this.buffetDetails.phone = data.phone;
      this.buffetDetails.email = data.email;
      this.buffetDetails.address = data.address;
      this.buffetDetails.district = data.district;
      this.buffetDetails.state = data.state;
      this.buffetDetails.city = data.city;
      this.buffetDetails.paymentMethod = data.payment_method;
      this.buffetDetails.description = data.description;
      this.buffetDetails.rating = data.rating;

      await this.getEventData(index);
    },

    async getEventData(index){
      let response = await fetch(`http://localhost:3000/api/v1/events?buffet_id=${index}`)

      let data = await response.json();

      this.eventsList = []

      data.forEach(item => {
        let event = new Object();
        event.id = item.id;
        event.name = item.name;
        event.description = item.description;
        event.minQtd = item.min_qtd;
        event.maxQtd = item.max_qtd;
        event.duration = item.duration;
        event.menu = item.menu;
        event.drinks = item.drinks;
        event.decoration = item.decoration;
        event.valet = item.valet;
        event.onlyLocal = item.only_local;
        event.prices = item.prices;
        event.basePrice = item.prices.base_price;
        event.additionalPerson = item.prices.additional_person;
        event.extraHour = item.prices.extra_hour;
        event.spBasePrice = item.prices.sp_base_price;
        event.spAdditionalPerson = item.prices.sp_additional_person;
        event.spExtraHour = item.prices.sp_extra_hour;

        this.eventsList.push(event)
      })
    },

    async checkAvailability(index){
      let response = await fetch(`http://localhost:3000/api/v1/events/${index}/check_date?date=${this.eventDate}&guest_qtd=${this.eventGuests}`)

      this.eventAvailabilityData = await response.json();
      this.eventAvailabilityStatus = response.status;
    },

    closeDetails(){
      this.buffetDetails.show = false;
      this.eventAvailabilityData = null;
      this.eventAvailabilityStatus = null;
    }
  }
})

app.mount('#app');