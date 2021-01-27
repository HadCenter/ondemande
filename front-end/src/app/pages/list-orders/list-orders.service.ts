import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class ListOrderService {

    private url = "//3.20.173.5:8080/"

    constructor(private http: HttpClient) {
    }

    public advanceTableData: any = [
        {
            "type": "delivery",
            "taskId": "my-task-00",
            "taskReference": "task-ref-001-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-01",
            "taskReference": "task-ref-002-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                },
                {
                    "productId": "001235",
                    "name": "BOISSON",
                    "description": "Coca Cola, 100ml",
                    "type": "boisson",
                    "barcode": "11231213121",
                    "quantity": 2,
                    "unitPrice": 5.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00015",
            "collectedAmount": 0,
            "price": 0,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-14T12:34:56.012Z",
            "serviceTime": 40,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Ahmed Torres",
                "phone": "+32 477 77 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Residence Swag",
                "number": "16-A",
                "street": "139 Rue De L'Abbé Groult",
                "city": "Paris",
                "zip": "75015",
                "country": "FR",
                "longitude": "2.302570",
                "latitude": "48.835810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "delicate",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-06",
            "taskReference": "task-ref-007-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 0,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 10,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Antoine Griezmann",
                "phone": "+32 022 19 74 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Residence le Richelieu",
                "number": "11-C",
                "street": "23 Rue Des Loges",
                "city": "Maisons-Laffitte",
                "zip": "78600",
                "country": "FR",
                "longitude": "2.130120",
                "latitude": "48.944570",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-02",
            "taskReference": "task-ref-003-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 0,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 65,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "William Agassi",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "24 Rue Santerre",
                "city": "Paris",
                "zip": "75012",
                "country": "FR",
                "longitude": "2.400000",
                "latitude": "48.842910",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "delicate",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-03",
            "taskReference": "task-ref-004-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 0,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 80,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Karla Zorel",
                "phone": "+32 477 23 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Residence Gallieni",
                "number": "12-B",
                "street": "66 Boulevard Gallieni",
                "city": "Issy-Les-Moulineaux",
                "zip": "92130",
                "country": "FR",
                "longitude": "2.267100",
                "latitude": "48.827550",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-04",
            "taskReference": "task-ref-005-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 0,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 20,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Benjamin Mendy",
                "phone": "+32 087 20 87 20",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Residence Gallieni",
                "number": "11-C",
                "street": "66 Boulevard Gallieni",
                "city": "Issy-Les-Moulineaux",
                "zip": "92130",
                "country": "FR",
                "longitude": "2.267100",
                "latitude": "48.827550",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "delicate",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-05",
            "taskReference": "task-ref-006-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 0,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 0,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "David Xavier",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "Aberdeen St.",
                "city": "Brussels",
                "zip": "1050",
                "country": "BE",
                "longitude": "50.165168",
                "latitude": "17.1135468",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-10",
            "taskReference": "task-ref-010-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-11",
            "taskReference": "task-ref-011-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-12",
            "taskReference": "task-ref-012-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-13",
            "taskReference": "task-ref-013-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-14",
            "taskReference": "task-ref-014-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-14",
            "taskReference": "task-ref-014-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-15",
            "taskReference": "task-ref-015-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-16",
            "taskReference": "task-ref-016-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-17",
            "taskReference": "task-ref-017-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-18",
            "taskReference": "task-ref-018-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-19",
            "taskReference": "task-ref-019-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-20",
            "taskReference": "task-ref-020-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-21",
            "taskReference": "task-ref-021-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-23",
            "taskReference": "task-ref-023-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        {
            "type": "delivery",
            "taskId": "my-task-24",
            "taskReference": "task-ref-024-d",
            "product": "string",
            "products": [
                {
                    "productId": "001234",
                    "name": "CHEESE",
                    "description": "Goat cheese pack, 400gr",
                    "type": "food",
                    "barcode": "11231212121",
                    "quantity": 3,
                    "unitPrice": 13.95,
                    "isSubstitution": false,
                    "quantityRejected": 0
                }
            ],
            "hasBeenPaid": false,
            "notificationSettings": {
                "sms": false,
                "email": false
            },
            "client": "00014",
            "collectedAmount": 0,
            "price": 43,
            "round": "R01",
            "sequence": 1,
            "instructions": "Once inside of the building, follow the corridor on the right and take the elevator",
            "date": "2019-03-13T12:34:56.012Z",
            "serviceTime": 100,
            "maxTransitTime": 0,
            "timeWindow": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "timeWindow2": {
                "start": "2019-03-13T12:34:56.012Z",
                "stop": "2019-03-13T12:34:56.012Z"
            },
            "contact": {
                "account": "ACC123456789",
                "name": "Acme Inc.",
                "person": "Paco Jones",
                "phone": "+32 477 99 99 99",
                "email": "something@gmail.com",
                "language": "fr",
                "buildingInfo": {
                    "floor": 5,
                    "hasElevator": true,
                    "digicode1": "1234A",
                    "digicode2": "4321A",
                    "hasInterphone": true,
                    "interphoneCode": "4524#"
                }
            },
            "address": {
                "building": "Villa Delaroche",
                "number": "31-A",
                "street": "1 Rue Jean Mermoz",
                "city": "Châtillon",
                "zip": "92320",
                "country": "FR",
                "longitude": "2.291240",
                "latitude": "48.808810",
                "addressLines": [
                    "string"
                ]
            },
            "items": [
                {
                    "type": "string",
                    "name": "string",
                    "description": "string",
                    "barcode": "string",
                    "barcodeEncoding": "CODE128",
                    "reference": "string",
                    "quantity": 0,
                    "dimensions": {
                        "weight": 200,
                        "volume": 0.2
                    },
                    "labels": [
                        "frozen",
                    ],
                    "skills": [
                        "speaks_french"
                    ],
                    "metadata": {
                        "property1": 23,
                        "property2": "Hello World"
                    },
                    "conditionalChecklists": [
                        {
                            "name": "string",
                            "questions": [
                                {
                                    "question": "string",
                                    "tips": "string",
                                    "success": 0,
                                    "failed": 0
                                }
                            ]
                        }
                    ]
                }
            ],
            "requires": {
                "pickup": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "delivery": {
                    "dispatcher": {
                        "scan": false
                    },
                    "driver": {
                        "prepCheckList": false,
                        "prepScan": false,
                        "signature": false,
                        "signatureAndComment": false,
                        "signatureAndItemConcerns": false,
                        "scan": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "service": {
                    "driver": {
                        "signature": false,
                        "signatureAndComment": false,
                        "comment": false,
                        "photo": false
                    },
                    "stop": {
                        "onSite": false
                    },
                    "failure": {
                        "photo": false
                    }
                },
                "other": {
                    "driver": {
                        "timer": false
                    }
                }
            },
            "metadata": {
                "property1": 23,
                "property2": "Hello World"
            },
            "category": "B2B"
        },
        

    ]

    public getAll(): Observable<any> {
        return this.http.get(this.url + 'commands');
    }

    public save(command: any): Observable<any> {
        let result: Observable<Object>;
        result = this.http.post(this.url + 'newcommand', command);
        return result;
    }

    public findByTaskId(taskId: String): Observable<any> {
        return this.http.get(this.url + 'commands/taskId/' + taskId);
    }



    public getAdvancedHeaders() {
        return [
            {
                name: '# Commande',
                sort: 0,
            },
            {
                name: '# Client',
                sort: 0,
                id: 'ref_client'
            },
            // {
            //     name: 'Type',
            //     sort: 0,
            // },
            {
                name: 'Type articles',
                sort: null,
            },
            {
                name: 'Date livraison',
                sort: 0,
            },
            {
                name: 'Status',
                sort: null,
            },
            {
                name: 'Nom destinataire',
                sort: 0,
            },
            // {
            //     name: 'CP',
            //     sort: 0,
            // },
            // {
            //     name: 'Telephone',
            //     sort: 0,
            // },
            // {
            //     name: 'Email',
            //     sort: 0,
            // },

        ];
    }

    public getAdvancedTableNumOfPage(countPerPage) {
        return Math.ceil(this.advanceTableData.length / countPerPage);
    }

    public getAdvancedTablePage(page, countPerPage) {
        return this.advanceTableData.slice((page - 1) * countPerPage, page * countPerPage);
    }

    public changeAdvanceSorting(order, index) {
        this.advanceTableData = this.sortByAttributeObject(this.advanceTableData, order, index);
    }

    public sortByAttributeObject(advanceTableData, order, index) {
        if (index == 0) {
            return this.sortByRefcom(advanceTableData, order, index);
        }
        else if (index == 1) {
            return this.sortByRefclient(advanceTableData, order, index);
        }
        else if (index == 2) {
            return this.sortByType(advanceTableData, order, index);
        }
        else if (index == 3) {
            return this.sortByDateOrder(advanceTableData, order, index);
        }
        else if (index == 5) {
            return this.sortByClientName(advanceTableData, order, index);
        }

    }

    public getOrderById(id) {
        var result = this.advanceTableData.filter(obj => {
            return obj.taskId === id;
        })
        return result;
    }

    private sortByRefcom(array, order, value) {
        const compareFunction = (a, b) => {
            if (a.taskReference > b.taskReference) {
                return 1 * order;
            }
            if (a.taskReference < b.taskReference) {
                return -1 * order;
            }
            return 0;
        }

        return array.sort(compareFunction);
    }
    private sortByRefclient(array, order, value) {
        const compareFunction = (a, b) => {
            if (a.client > b.client) {
                return 1 * order;
            }
            if (a.client < b.client) {
                return -1 * order;
            }
            return 0;
        }

        return array.sort(compareFunction);
    }
    private sortByType(array, order, value) {
        const compareFunction = (a, b) => {
            if (a.type > b.type) {
                return 1 * order;
            }
            if (a.type < b.type) {
                return -1 * order;
            }
            return 0;
        }

        return array.sort(compareFunction);
    }
    private sortByDateOrder(array, order, value) {
        const compareFunction = (a, b) => {
            if (a.date.slice(0,10) > b.date.slice(0,10)) {
                return 1 * order;
            }
            if (a.date.slice(0,10) < b.date.slice(0,10)) {
                return -1 * order;
            }
            return 0;
        }

        return array.sort(compareFunction);
    }
    private sortByQuantite(array, order, value) {
        const compareFunction = (a, b) => {
            if (a.products.length > b.products.length) {
                return 1 * order;
            }
            if (a.products.length < b.products.length) {
                return -1 * order;
            }
            return 0;
        }

        return array.sort(compareFunction);
    }
    private sortByClientName(array, order, value) {
        const compareFunction = (a, b) => {
            if (a.contact.person > b.contact.person) {
                return 1 * order;
            }
            if (a.contact.person < b.contact.person) {
                return -1 * order;
            }
            return 0;
        }

        return array.sort(compareFunction);
    }
    private sortByCp(array, order, value) {
        const compareFunction = (a, b) => {
            if (a.address.zip > b.address.zip) {
                return 1 * order;
            }
            if (a.address.zip < b.address.zip) {
                return -1 * order;
            }
            return 0;
        }

        return array.sort(compareFunction);
    }
  
}
