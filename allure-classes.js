//*** Classes
class Services {
    constructor(price) {this._price = parseFloat(price);}
    get price() {return this._price;}
    set price(price) {this._price = parseFloat(price);}
}
class ApartmentService extends Services {
    constructor(name, price, isAvailable, isAdd) {
        super(price);
        this._name = name;
        this._isAvailable = isAvailable;
        this._isAdd = isAdd;
    }
    get name() {return this._name;}
    get isAvailable() {return this._isAvailable;}
    get isAdd() {return this._isAdd;}
    set isAdd(isAdd) {this._isAdd = isAdd;}
}
class Apartment extends Services {
    constructor(price = 0, id = 0, title = "", meters = 0, location = "", urlImage = "", urlImages = [], desc = "", services = [], deposit = 0, startDate = "", endDate = "",
        conditioner = false, firstLine = false, withPets = false, wifi = false, isForSale = false, priceSell = 0, monthRent = false, monthPrice = 0, dayRent = false, numPeople = 0,
        numBedrooms = 0, numBathrooms = 0, isHouse = false, parking = false, isVilla = false) {
        super(price);
        this._id = id;
        this._title = title;
        this._meters = meters;
        this._location = location;
        this._urlImage = urlImage;
        this._urlImages = urlImages;
        this._desc = desc;
        this._services = services;
        this._deposit = deposit;
        this._startDate = startDate;
        this._endDate = endDate;
        this._conditioner = conditioner;
        this._firstLine = firstLine;
        this._withPets = withPets;
        this._wifi = wifi;
		this._isForSale = isForSale;
		this._priceSell = priceSell;
		this._monthRent = monthRent;
		this._monthPrice = monthPrice;
        this._dayRent = dayRent;
        this._numPeople = numPeople;
        this._numBedrooms = numBedrooms;
        this._numBathrooms = numBathrooms;
        this._isHouse = isHouse;
        this._parking = parking;
		this._isVilla = isVilla;
    }
    // Getters
    get id(){return this._id;}
    get title() {return this._title;}
    get meters() {return this._meters;}
    get location() {return this._location;}
    get urlImage() {return this._urlImage;}
    get urlImages() {return this._urlImages;}
    get desc() {return this._desc;}
    get services() {return this._services;}
    get deposit() {return this._deposit;}
    get startDate() {return this._startDate;}
    get endDate() {return this._endDate;}
    get conditioner() {return this._conditioner;}
    get firstLine() {return this._firstLine}
    get withPets() {return this._withPets;}
    get wifi() {return this._wifi;}
	get isForSale() {return this._isForSale;}
	get priceSell() {return this._priceSell;}
	get monthRent() {return this._monthRent;}
	get monthPrice() {return this._monthPrice;}
    get dayRent() {return this._dayRent;}
    get numPeople() {return this._numPeople;}
    get numBedrooms() {return this._numBedrooms;}
    get numBathrooms() {return this._numBathrooms;}
    get isHouse() {return this._isHouse;}
    get parking() {return this._parking;}
	get isVilla() {return this._isVilla;}
    // Setters
    set id(newId) {this._id = newId;}
    set title(title) {this._title = title;}
    set meters(meters) {this._meters = meters;}
    set location(location) {this._location = location;}
    set urlImage(urlImage) {this._urlImage = urlImage;}
    set desc(desc) {this._desc = desc;}
    set services(services) {this._services = services;}
    set deposit(newDeposit) {this._deposit = newDeposit;}
    set startDate(startDate) {this._startDate = startDate;}
    set endDate(endDate) {this._endDate = endDate;}
    set conditioner(newConditioner) {this._conditioner = newConditioner;}
    set firstLine(newFirstLine) {this._firstLine = newFirstLine;}
    set withPets(newWithPets) {this._withPets = newWithPets;}
    set wifi(newWifi) {this._wifi = newWifi;}
}
class CarService extends Services {
    constructor(name, price, isAvailable, isAdd) {
        super(price);
        this._name = name;
        this._isAvailable = isAvailable;
        this._isAdd = isAdd;
    }
    get name() {return this._name;}
    get isAvailable() {return this._isAvailable;}
    get isAdd() {return this._isAdd;}
    set isAdd(isAdd) {this._isAdd = isAdd;}
}
class Car extends Services {
    constructor(price = 0, id = 0, brand = '', model = '', includedKmDay = 0, oneExtraKmPrice = 0, deposit = 0, urlImage = '', urlImages = [], desc = '', services = [], startDate = '', endDate = '',
		color = '', hp = 0, numPeople = 0, suitcases = 0, isSportCar = false, topSpeed = 0, timeToHundred = 0, isManual = false) {
        super(price);
        this._id = id;
        this._brand = brand;
        this._model = model;
        this._includedKmDay = includedKmDay;
        this._oneExtraKmPrice = oneExtraKmPrice;
        this._deposit = deposit;
        this._urlImage = urlImage;
        this._urlImages = urlImages;
        this._desc = desc;
        this._services = services;
        this._startDate = startDate;
        this._endDate = endDate;
        this._color = color;
        this._hp = hp;
		this._numPeople = numPeople;
		this._suitcases = suitcases;
		this._isSportCar = isSportCar;
		this._topSpeed = topSpeed;
		this._timeToHundred = timeToHundred;
		this._isManual = isManual;
    }
    // Getters
    get id() {return this._id;}
    get brand() {return this._brand;}
    get model() {return this._model;}
    get includedKmDay() {return this._includedKmDay;}
    get oneExtraKmPrice() {return this._oneExtraKmPrice;}
    get deposit() {return this._deposit;}
    get urlImage() {return this._urlImage;}
    get urlImages() {return this._urlImages;}
    get desc() {return this._desc;}
    get services() {return this._services;}
    get startDate() {return this._startDate;}
    get endDate() {return this._endDate;}
    get color() {return this._color;}
    get hp() {return this._hp;}
	get numPeople() {return this._numPeople;}
	get suitcases() {return this._suitcases;}
	get isSportCar() {return this._isSportCar;}
	get topSpeed() {return this._topSpeed;}
	get timeToHundred() {return this._timeToHundred;}
	get isManual() {return this._isManual;}
    // Setters
    set id(newId) {this._id = newId;}
    set brand(newBrand) {this._brand = newBrand;}
    set model(newModel) {this._model = newModel;}
    set includedKmDay(newIncludedKmDay) {this._includedKmDay = newIncludedKmDay;}
    set oneExtraKmPrice(newOneExtraKmPrice) {this._oneExtraKmPrice = newOneExtraKmPrice;}
    set deposit(newDeposit) {this._deposit = newDeposit;}
    set urlImage(newUrlImage) {this._urlImage = newUrlImage;}
    set urlImages(newUrlImages) {this._urlImages = newUrlImages;}
    set desc(newDesc) {this._desc = newDesc;}
    set services(newServices) {this._services = newServices;}
    set startDate(startDate) {this._startDate = startDate;}
    set endDate(endDate) {this._endDate = endDate;}
    set color(newColor) {this._color = newColor;}
    set hp(newHp) {this._hp = newHp;}
}
class YachtService extends Services {
    constructor(name, price, isAvailable, isAdd) {
        super(price);
        this._name = name;
        this._isAvailable = isAvailable;
        this._isAdd = isAdd;
    }
    get name() {return this._name;}
    get isAvailable() {return this._isAvailable;}
    get isAdd() {return this._isAdd;}
    set isAdd(isAdd) {this._isAdd = isAdd;}
}
class Yacht extends Services {
    constructor(price = 0, id = 0, title = '', deposit = 0, urlImage = '', urlImages = [], desc = '', services = [], startDate = '', endDate = '', length = 0, width = 0, cabins = 0, bathrooms = 0,
		crew = 0, maxPeople = 0, priceWeek = 0) {
        super(price);
        this._id = id;
        this._title = title;
        this._deposit = deposit;
        this._urlImage = urlImage;
        this._urlImages = urlImages;
        this._desc = desc;
        this._services = services;
        this._startDate = startDate;
        this._endDate = endDate;
        this._length = length;
        this._width = width;
        this._cabins = cabins;
        this._bathrooms = bathrooms;
        this._crew = crew;
        this._maxPeople = maxPeople;
        this._priceWeek = priceWeek;
    }
    // Getters
    get id() {return this._id;}
    get title() {return this._title;}
    get deposit() {return this._deposit;}
    get urlImage() {return this._urlImage;}
    get urlImages() {return this._urlImages;}
    get desc() {return this._desc;}
    get services() {return this._services;}
    get startDate() {return this._startDate;}
    get endDate() {return this._endDate;}
    get length() {return this._length;}
    get width() {return this._width;}
    get cabins() {return this._cabins;}
    get bathrooms() {return this._bathrooms;}
    get crew() {return this._crew;}
    get maxPeople() {return this._maxPeople;}
    get priceWeek() {return this._priceWeek;}
    // Setters
    set id(newId) {this._id = newId;}
    set title(newTitle) {this._title = newTitle;}
    set deposit(newDeposit) {this._deposit = newDeposit;}
    set urlImage(newUrlImage) {this._urlImage = newUrlImage;}
    set urlImages(newUrlImages) {this._urlImages = newUrlImages;}
    set desc(newDesc) {this._desc = newDesc;}
    set services(newServices) {this._services = newServices;}
    set startDate(startDate) {this._startDate = startDate;}
    set endDate(endDate) {this._endDate = endDate;}
    set length(newLength) {this._length = newLength;}
    set width(newWidth) {this._width = newWidth;}
    set cabins(newCabins) {this._cabins = newCabins;}
    set bathrooms(newBathrooms) {this._bathrooms = newBathrooms;}
    set crew(newCrew) {this._crew = newCrew;}
    set maxPeople(newMaxPeople) {this._maxPeople = newMaxPeople;}
    set priceWeek(newPriceWeek) {this._priceWeek = newPriceWeek;}
}
class PlaneService extends Services {
    constructor(name, price, isAvailable, isAdd) {
        super(price);
        this._name = name;
        this._isAvailable = isAvailable;
        this._isAdd = isAdd;
    }
    get name() {return this._name;}
    get isAvailable() {return this._isAvailable;}
    
    get isAdd() {return this._isAdd;}
    set isAdd(isAdd) {this._isAdd = isAdd;}
}
class Plane extends Services {
    constructor(price = 0, id = 0, title = '', urlImage = '', urlImages = [], desc = '', services = [], startDate = '', endDate = '', passengers = 0, isIndividualPrice = false) {
        super(price);
        this._id = id;
        this._title = title;
        this._urlImage = urlImage;
        this._urlImages = urlImages;
        this._desc = desc;
        this._services = services;
        this._startDate = startDate;
        this._endDate = endDate;
        this._passengers = passengers;
        this._isIndividualPrice = isIndividualPrice;
    }
    // Getters
    get id() {return this._id;}
    get title() {return this._title;}
    get urlImage() {return this._urlImage;}
    get urlImages() {return this._urlImages;}
    get desc() {return this._desc;}
    get services() {return this._services;}
    get startDate() {return this._startDate;}
    get endDate() {return this._endDate;}
    get passengers() {return this._passengers;}
    get isIndividualPrice() {return this._isIndividualPrice;}
    // Setters
    set id(newId) {this._id = newId;}
    set title(newTitle) {this._title = newTitle;}
    set urlImage(newUrlImage) {this._urlImage = newUrlImage;}
    set urlImages(newUrlImages) {this._urlImages = newUrlImages;}
    set desc(newDesc) {this._desc = newDesc;}
    set services(newServices) {this._services = newServices;}
    set startDate(newStartDate) {this._startDate = newStartDate;}
    set endDate(newEndDate) {this._endDate = newEndDate;}
    set passengers(newPassengers) {this._passengers = newPassengers;}
    set isIndividualPrice(newIsIndividualPrice) {this._isIndividualPrice = newIsIndividualPrice;}
}