const express = require('express');
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const session = require("express-session");

// const {createRequireFromPath}=require ("module")


router.get('/', (req, res) => {
    db.events.findAll().then(events => {
        res.json(events)
    }).catch(err => {
        console.log(err);
        res.status(500).end()
    });
});


router.get('/:id', (req, res)=> {
    db.events.findOne({
        where: {
            id: req.params.id
        }
    }).then(events => {
        res.json(events)
    }).catch(err => {
        console.log(err);
        res.status(500).end()
    })
})

router.post("/createEvents", (req, res) => {
    if(!req.session.user){
        res.status(401).send("Please log in or set up an account")
    }
    else {
    db.events.create({
        start_time: req.body.start_time,
        event_category: req.body.event_category,
        event_name: req.body.event_name,
        event_location: req.body.event_location,
        meeting_spot: req.body.meeting_spot,
        num_of_attendees: parseInt(req.body.num_of_attendees),
        min_age: parseInt(req.body.min_age),
        additional_info: req.body.additional_info,
        usersId: req.session.user.id
    }).then(newEvent => {
        res.json(newEvent);
    }).catch(err => {
        console.log(err);
        res.status(500).end();
    });
}
});

router.put("/:id", (req, res) =>{
    db.events.findOne({
        where: {
            id: req.params.id
        }
    }).then(events => {
        if(!req.session.user || events.usersId !== req.user.id) {
            return res.status(401).send('Please, Sign In')
        } else {
            db.events.update({
                start_time: req.body.start_time,
                event_category: req.body.event_category,
                event_name: req.body.event_name,
                event_location: req.body.event_location,
                meeting_spot: req.body.meeting_spot,
                num_of_attendees: parseInt(req.body.num_of_attendees),
                min_age: parseInt(req.body.min_age),
                additional_info: req.body.additional_info
            }, {
                where: {
                    id: req.params.id
                }

            }).then(updatedEvents => {
                res.json(updatedEvents)
            }).catch(err => {
                res.status(500).end()
            })
        }
    })
})

router.get('/readsessions', (req, res) => {
    res.json(req.session);
});



router.delete("/:id", function (req, res) {
    db.events.findOne({
        where: {
            id: req.params.id
        }
    }).then(events => {
        if (!req.session.user || events.usersId !== req.session.user.id) {
            return res.status(401).send('login required/ not your event')
        } else {
            db.events.destroy({
                where: {
                    id: req.params.id
                }
            }).then(deletedEvents => {
                res.json(deletedEvents)
            }).catch(err => {
                console.log(err);
                res.status(500).end()
            })
        }
    })
    })

//     db.events.destroy({
//         start_time: req.body.start_time,
//         event_category: req.body.event_category,
//         event_name: req.body.event_name,
//         event_location: req.body.event_location,
//         meeting_spot: req.body.meeting_spot,
//         num_of_attendees: parseInt(req.body.num_of_attendees),
//         min_age: parseInt(req.body.min_age),
//         additional_info: req.body.additional_info
//     }, {
//         where: {
//             id: req.params.id
//         }
//     }).then(function (dbEvents) {
//         res.json(dbEvents);
//     }).catch(function (err) {
//         res.status(500).json(err);
//     });
// });

// eventCard.route('/delete').delete(function(req, res) {
//     let id = req.params.id;
//     eventCards.findByIdAndRemove(id).exec();
//     res.redirect('/');
// });


module.exports = router 
