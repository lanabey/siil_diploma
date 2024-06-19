const Config = require('../config');
const express = require('express');
const pick = require('lodash/pick');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');

const Alarms = require('../models/Alarms');
const Bus = require('../models/Bus');
const Organizations = require('../models/Organizations');
const NonstandardWork = require('../models/NonstandardWork');
const DailyWork = require('../models/DailyWork');
const Payslips = require('../models/Payslips');
const Profiles = require('../models/Profiles');
const Reports = require('../models/Reports');
const Schedules = require('../models/Schedules');
const Phones = require('../models/Phones');

const transporter = nodemailer.createTransport({
    auth: {
        user: Config.MAIL_ADDRESS,
        pass: Config.MAIL_PASSWORD,
    },
    host: Config.DB_HOST,
    port: 465,
    secure: true,
});

const router = express.Router();

router
    .route('/schedules')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const routes = await Schedules.getRoutes();

            res.json(routes);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    });

router
    .route('/schedules/all')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const routes = await Schedules.getRoutesWithTime();

            res.json(routes);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    });

router
    .route('/schedules/filter')
    .post(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const data = pick(req.body, 'sortType', 'sortOrder', 'startTime');
            const routes = await Schedules.getTimetablesWithFilter(data);

            res.json(routes);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    });

router
    .route('/schedule')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const data = req.query;
            const routes = await Schedules.getRoute(data);

            res.json(routes);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

router
    .route('/schedules/create')
    .put(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const data = pick(req.body, 'timetable', 'timetable_type', 'departure_time', 'mg_start_time', 'first_lunch_time', 'second_lunch_time', 'shift_start', 'shift_end', 'route_2', 'ev_start_time', 'third_lunch_time', 'fourth_lunch_time', 'shifts_finish', 'comeback_time', 'bus_routes_num', 'name_trmnl_one', 'dist_trmnl_one', 'name_trmnl_two', 'dist_trmnl_two', 'start_trmnl', 'finish_trmnl', 'route_dist', 'total_dist', 'shift_trmnl');

            const routes = await Schedules.createSchedule(data);

            res.json(routes);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

router
    .route('/schedules/update')
    .post(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const data = pick(req.body, [
                'updateType', 'scheduleKey', 'timetableTypeKey', 'schedule', 'timetableType', 'departureTime', 'morningDeparture', 'firstLunch', 'secondLunch', 'shiftChangeStart', 'shiftChangeEnd', 'route2', 'eveningDeparture', 'thirdLunch', 'fourthLunch', 'endOfShift', 'arrivalTime', 'tripsCount', 'finalStop1', 'distanceToFinalStop1', 'finalStop2', 'distanceToFinalStop2', 'startFinalStop', 'finishFinalStop', 'routeLength', 'totalDist', 'trmnlDist'
            ]);
            const {
                updateType, scheduleKey, timetableTypeKey, schedule, timetableType, departureTime, morningDeparture, firstLunch, secondLunch, shiftChangeStart, shiftChangeEnd, route2, eveningDeparture, thirdLunch, fourthLunch, endOfShift, arrivalTime, tripsCount, finalStop1, distanceToFinalStop1, finalStop2, distanceToFinalStop2, startFinalStop, finishFinalStop, routeLength, totalDist, trmnlDist
            } = data;

            let updateData = {};

            switch (updateType) {
                case 'schedule':
                    if (!schedule) return res.status(400).json({ error: 'Schedule is required!' });
                    updateData.timetable = schedule;
                    break;
                case 'timetableType':
                    if (!timetableType) return res.status(400).json({ error: 'Timetable Type is required!' });
                    updateData.timetable_type = timetableType;
                    break;
                case 'departureTime':
                    if (!departureTime) return res.status(400).json({ error: 'Departure Time is required!' });
                    updateData.departure_time = departureTime;
                    break;
                case 'morningDeparture':
                    if (!morningDeparture) return res.status(400).json({ error: 'Morning Departure is required!' });
                    updateData.mg_start_time = morningDeparture;
                    break;
                case 'firstLunch':
                    if (!firstLunch) return res.status(400).json({ error: 'First Lunch Time is required!' });
                    updateData.first_lunch_time = firstLunch;
                    break;
                case 'secondLunch':
                    if (!secondLunch) return res.status(400).json({ error: 'Second Lunch Time is required!' });
                    updateData.second_lunch_time = secondLunch;
                    break;
                case 'shiftChangeStart':
                    if (!shiftChangeStart) return res.status(400).json({ error: 'Shift Change Start Time is required!' });
                    updateData.shift_start = shiftChangeStart;
                    break;
                case 'shiftChangeEnd':
                    if (!shiftChangeEnd) return res.status(400).json({ error: 'Shift Change End Time is required!' });
                    updateData.shift_end = shiftChangeEnd;
                    break;
                case 'route2':
                    if (!route2) return res.status(400).json({ error: 'Route 2 is required!' });
                    updateData.route_2 = route2;
                    break;
                case 'eveningDeparture':
                    if (!eveningDeparture) return res.status(400).json({ error: 'Evening Departure is required!' });
                    updateData.ev_start_time = eveningDeparture;
                    break;
                case 'thirdLunch':
                    if (!thirdLunch) return res.status(400).json({ error: 'Third Lunch Time is required!' });
                    updateData.third_lunch_time = thirdLunch;
                    break;
                case 'fourthLunch':
                    if (!fourthLunch) return res.status(400).json({ error: 'Fourth Lunch Time is required!' });
                    updateData.fourth_lunch_time = fourthLunch;
                    break;
                case 'endOfShift':
                    if (!endOfShift) return res.status(400).json({ error: 'End of Shift is required!' });
                    updateData.shifts_finish = endOfShift;
                    break;
                case 'arrivalTime':
                    if (!arrivalTime) return res.status(400).json({ error: 'Arrival Time is required!' });
                    updateData.comeback_time = arrivalTime;
                    break;
                case 'tripsCount':
                    if (!tripsCount) return res.status(400).json({ error: 'Trips Count is required!' });
                    updateData.bus_routes_num = tripsCount;
                    break;
                case 'finalStop1':
                    if (!finalStop1) return res.status(400).json({ error: 'Final Stop 1 is required!' });
                    updateData.name_trmnl_one = finalStop1;
                    break;
                case 'distanceToFinalStop1':
                    if (!distanceToFinalStop1) return res.status(400).json({ error: 'Distance to Final Stop 1 is required!' });
                    updateData.dist_trmnl_one = distanceToFinalStop1;
                    break;
                case 'finalStop2':
                    if (!finalStop2) return res.status(400).json({ error: 'Final Stop 2 is required!' });
                    updateData.name_trmnl_two = finalStop2;
                    break;
                case 'distanceToFinalStop2':
                    if (!distanceToFinalStop2) return res.status(400).json({ error: 'Distance to Final Stop 2 is required!' });
                    updateData.dist_trmnl_two = distanceToFinalStop2;
                    break;
                case 'startFinalStop':
                    if (!startFinalStop) return res.status(400).json({ error: 'Start Final Stop is required!' });
                    updateData.start_trmnl = startFinalStop;
                    break;
                case 'finishFinalStop':
                    if (!finishFinalStop) return res.status(400).json({ error: 'Finish Final Stop is required!' });
                    updateData.finish_trmnl = finishFinalStop;
                    break;
                case 'routeLength':
                    if (!routeLength) return res.status(400).json({ error: 'Route Length is required!' });
                    updateData.route_dist = routeLength;
                    break;
                case 'totalDist':
                    if (!totalDist) return res.status(400).json({ error: 'Total Distance is required!' });
                    updateData.total_dist = totalDist;
                    break;
                case 'trmnlDist':
                    if (!trmnlDist) return res.status(400).json({ error: 'Terminal Distance is required!' });
                    updateData.shift_trmnl = trmnlDist;
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid update type!' });
            }

            const timetable = await Schedules.updateSchedule(scheduleKey, timetableTypeKey, updateData);
            res.status(200).json(timetable);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

router
    .route('/schedules/delete')
    .delete(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const { timetable, timetableType } = pick(req.body, 'timetable', 'timetableType');

            if (!timetable || timetableType === null) {
                return res.status(400).json({ error: 'Timetable and Timetable Type are required!' });
            }

            await Schedules.deleteSchedule(timetable, timetableType);

            res.status(200).json({ message: 'Timetable deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

router
    .route('/buses')
    .get(async (req, res) => {
        try {
            const buses = await Bus.getBuses();

            res.json(buses);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    });

router
    .route('/buses/create')
    .put(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const data = pick(req.body, 'bus_number', 'plate_number', 'bus_brand');
            data.profile_id = req.user.user_id;

            const bus = await Bus.createBus(data);

            res.json(bus);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

router
    .route('/buses/update')
    .post(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const data = pick(req.body, [
                'updateType', 'plateNumberKey', 'busNumber', 'plateNumber', 'brand'
            ]);
            const {
                updateType, plateNumberKey, busNumber, plateNumber, brand
            } = data;

            let updateData = {};

            switch (updateType) {
                case 'busNumber':
                    if (!busNumber) return res.status(400).json({ error: 'Bus number is required!' });
                    updateData.bus_number = busNumber;
                    break;
                case 'plateNumber':
                    if (!plateNumber) return res.status(400).json({ error: 'Plate number is required!' });
                    updateData.plate_number = plateNumber;
                    break;
                case 'brand':
                    if (!brand) return res.status(400).json({ error: 'Brand Time is required!' });
                    updateData.bus_brand = brand;
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid update type!' });
            }

            const bus = await Bus.updateBus(plateNumberKey, updateData);
            res.status(200).json(bus);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

router
    .route('/buses/delete')
    .delete(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const { plateNumber } = pick(req.body, 'plateNumber');

            if (!plateNumber) {
                return res.status(400).json({ error: 'Plate number is required!' });
            }

            await Bus.deleteBus(plateNumber);

            res.status(200).json({ message: 'Bus deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

router
    .route('/shiftdata')
    .post(async (req, res) => {
        try {
            const data = pick(req.body, 'shift', 'timetable', 'timetable_type');
            const shifts = await Schedules.getShift(data);

            res.json(shifts);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    });

router
    .route('/routenum')
    .post(async (req, res) => {
        try {
            const data = pick(req.body, 'timetable', 'timetable_type');

            const count = await Schedules.getRouteNum(data);

            res.json(count);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    });

router
    .route('/routedist')
    .post(async (req, res) => {
        try {
            const data = pick(req.body, 'timetable', 'timetable_type');

            const vals = await Schedules.getAtpRouteDist(data);

            res.json(vals);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    });

router
    .route('/dailywork')
    .post(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const data = pick(req.body, 'work_date', 'plate_number', 'timetable', 'timetable_type', 'shift_type', 'enter_time', 'bus_malfunction', 'malfunction_reas', 'odometer_start', 'odometer_end', 'total_dist', 'single_route_dist', 'work_routes_num', 'shifts_num', 'route_num_deviation', 'lunch_intraffic_time', 'ticketsale_num', 'first_fueling', 'refueling', 'final_fueling', 'total_fueling', 'exit_time', 'work_onroute_time', 'work_TFT_time');

            data.profile_id = req.user.user_id;

            const report = await DailyWork.createReport(data);

            res.status(200).json(report);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    });

router
    .route('/user/profile')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const profileId = req.user.user_id;

            const user = await Profiles.getUserById(profileId);

            res.json(user);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    });

router
    .route('/user/update')
    .post(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const data = pick(req.body, ['updateType', 'pin', 'empId', 'tin', 'ticketPrice', 'fullName']);
            const { updateType, pin, empId, ticketPrice, fullName } = data;
            const profileId = req.user.user_id;
            let updateData = {};

            switch (updateType) {
                case 'pin':
                    if (!pin) return res.status(400).json({ error: 'Pin is required!' });
                    updateData.pin = await bcrypt.hash(pin, 10);
                    break;
                case 'empId':
                    if (!empId) return res.status(400).json({ error: 'Employee ID is required!' });
                    updateData.emp_id = empId;
                    break;
                case 'price':
                    if (!ticketPrice) return res.status(400).json({ error: 'Ticket Price is required!' });
                    updateData.ticket_price = ticketPrice;
                    break;
                case 'name':
                    if (!fullName) return res.status(400).json({ error: 'Full Name is required!' });
                    updateData.driver_name = fullName;
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid update type!' });
            }

            const user = await Profiles.updateUser(profileId, updateData);
            res.status(200).json(user);

        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

router
    .route('/alarms/get')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const profileId = req.user.user_id;

            const alarms = await Alarms.getAlarm(profileId);

            res.json(alarms);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    });

router
    .route('/alarms/getup')
    .post(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const profileId = req.user.user_id;
            const { getupTime } = req.body;

            await Alarms.createGetup(profileId, getupTime);

            res.json({ success: true, message: 'Getup time updated successfully' });

        } catch (err) {
            console.log(err);
            res.status(404).json({ success: false, message: 'Error updating getup time' });
        }
    });

router
    .route('/alarms/leave')
    .post(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const profileId = req.user.user_id;
            const { leaveTime } = req.body;

            await Alarms.createLeave(profileId, leaveTime);

            res.json({
                success: true,
                message: 'Leaving time updated successfully'
            });
        } catch (err) {
            console.log(err);
            res.status(404).json({ success: false, message: 'Error updating leave time' });
        }
    });

router
    .route('/phones')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const profileId = req.user.user_id;
            const type = req.query.type;

            if (!type) {
                return res.status(400).json({ error: 'Type parameter is required' });
            }

            const phones = await Phones.getPhonesByType(profileId, type);

            res.json(phones);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

router
    .route('/phones/all')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const profileId = req.user.user_id;

            const phones = await Phones.getPhonesAll(profileId);

            res.json(phones);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

router
    .route('/phones/update')
    .post(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const data = pick(req.body, 'phoneId', 'num');
            const { phoneId, num } = data;

            const phone = await Phones.updatePhone(phoneId, num);
            res.status(200).json(phone);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

router
    .route('/phones/create')
    .put(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const data = pick(req.body, 'num_name', 'num', 'num_type');
            data.profile_id = req.user.user_id;

            const phone = await Phones.createPhone(data);
            res.status(200).json(phone);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

router
    .route('/payslips')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const profileId = req.user.user_id;

            const payslips = await Payslips.getPayslips(profileId);
            res.json(payslips);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

router
    .route('/payslips/create')
    .put(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const data = pick(req.body, 'pay_period', 'adv_payment_date', 'adv_amount', 'payment_date', 'profit', 'total_payment', 'route_payment', 'TFT_payment', 'bonus_payment', 'income_tax', 'total_deductions', 'onroute_time', 'TFT_time');
            data.profile_id = req.user.user_id;

            const payslip = await Payslips.createPayslip(data);
            res.status(200).json(payslip);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

router
    .route('/support')
    .post(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect('/support?failure=true');
            }

            const data = pick(req.body, ['text', 'contactData']);
            const profileId = req.user.user_id;

            const user = await Profiles.getUserById(profileId);

            const mailOptions = {
                from: Config.MAIL_ADDRESS,
                to: 'sfc.mod@yandex.com',
                subject: 'Новая заявка в поддержку',
                html: `
                    <p>Пользователь: ${user.driver_name} (ID ${profileId}, ИНН: ${user.TIN_org})</p>
                    <p>Описание проблемы: ${data.text}</p>
                    <p>Контактные данные: ${data.contactData}</p>
                `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.redirect('/support?failure=true');
                }
                res.redirect('/support?success=true');
            });
        } catch (err) {
            res.redirect('/support?failure=true');
        }
    });

router
    .route('/reports/all')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const profileId = req.user.user_id;
            const reports = await Reports.getAllReports(profileId);

            res.json(reports);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    });

router
    .route('/reports/create')
    .put(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const data = pick(req.body,
                'reportName',
                'periodFrom',
                'periodTo',
                'timeOnRoute',
                'tftAccount',
                'totalWorkedTime',
                'mileage',
                'refueledDiesel',
                'ticketsSold',
                'shiftsCount',
                'routesCount',
                'routesList',
                'workedDaysCount',
                'takeHomePay',
                'totalAccrued',
                'incomeTax',
                'compareWithPayslip'
            );
            data.profile_id = req.user.user_id;

            let payslipData = {}, dwData = {};
            const payslipKeys = [
                'takeHomePay',
                'totalAccrued',
                'incomeTax'
            ], dwKeys = [
                'timeOnRoute',
                'tftAccount',
                'totalWorkedTime',
                'mileage',
                'refueledDiesel',
                'ticketsSold',
                'shiftsCount',
                'routesCount',
                'routesList',
                'workedDaysCount'
            ];

            dwKeys.forEach((key) => {
                if (data[key]) {
                    dwData[key] = true;
                }
            });

            payslipKeys.forEach((key) => {
                if (data[key]) {
                    payslipData[key] = true;
                }
            });

            let dwFilter = null, payslipFilter = null;

            if (Object.keys(dwData).length > 0) {
                dwData.periodFrom = data.periodFrom;
                dwData.periodTo = data.periodTo;
                dwData.profile_id = data.profile_id;

                dwFilter = await DailyWork.filterDW(dwData);
            }

            if (Object.keys(payslipData).length > 0) {
                payslipData.periodFrom = data.periodFrom;
                payslipData.periodTo = data.periodTo;
                payslipData.profile_id = data.profile_id;

                payslipFilter = await Payslips.filterPayslips(payslipData);
            }

            const report = await Reports.createReport(dwFilter, payslipFilter, data.profile_id, data.reportName, data.periodFrom, data.periodTo);

            res.status(200).json(report);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

router
    .route('/reports/view')
    .get(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const profileId = req.user.user_id;
            const reports = await Reports.getReport(profileId);

            res.json(reports);
        } catch (err) {
            res.status(400).json({ error: err });
        }
    });

router
    .route('/reports/delete')
    .delete(auth, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authorized!' });
            }

            const repId = pick(req.body, 'rep_id');

            if (!repId) {
                return res.status(400).json({ error: 'Id is required!' });
            }

            await Reports.deleteReport(repId.rep_id);

            res.status(200).json({ message: 'Report deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


module.exports = router;