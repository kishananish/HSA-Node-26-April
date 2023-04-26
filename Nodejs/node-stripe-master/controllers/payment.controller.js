const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);

const config = require("../config/stripe");
const stripe = require("stripe")(config.secretKey);

exports.index = (req, res) => {
  console.log("AAAAAAAAAAAAAAAAA");
  console.log(req.body);
  console.log("AAAAAAAAAAAAAAAAA");
  const fromDate = moment();
  const toDate = moment().add(10, "years");
  const range = moment().range(fromDate, toDate);

  const years = Array.from(range.by("year")).map((m) => m.year());
  const months = moment.monthsShort();

  return res.render("index", { months, years, message: req.flash() });
};

exports.payment = async (req, res) => {
  console.log("BBBBBBBBBBBBBB");
  console.log(req.body);
  console.log("BBBBBBBBBBBBB");
  const token = await createToken(req.body);
  if (token.error) {
    console.log("HHHHHHHHHHHHHHHHH");
    //  req.flash("danger", token.error);
    res.send(token.error);
    // return res.redirect("/");
  }
  if (!token.id) {
    console.log("KKKKKKKKKKKK");
    //  req.flash("danger", "Payment failed.");
    res.send("Payment failed");
    //return res.redirect("/");
  }

  const charge = await createCharge(token.id, 2000);
  //   if (charge && charge.status == "succeeded") {
  //     req.flash("success", "Payment completed.");
  //   } else {
  //     req.flash("danger", "Payment failed.");
  //   }

  res.send(charge);
  //return charge;
};

const createToken = async (cardData) => {
  console.log("CCCCCCCCCCCCC");
  console.log(cardData);
  console.log("CCCCCCCCCCCCC");
  let token = {};
  try {
    token = await stripe.tokens.create({
      card: {
        number: cardData.cardNumber,
        exp_month: cardData.month,
        exp_year: cardData.year,
        cvc: cardData.cvv,
        address_city: "Noida",
        address_country: "India",
        address_line1: "Near a char murti",
        address_state: "Uttar Pradesh",
        address_zip: "201009",
        name: "Prajapatijikishan",
        customer: "Jivaji",
      },
    });
  } catch (error) {
    switch (error.type) {
      case "StripeCardError":
        token.error = error.message;
        break;
      default:
        token.error = error.message;
        break;
    }
  }
  return token;
};

const createCharge = async (tokenId, amount) => {
  console.log("DDDDDDDDDDD");
  console.log(tokenId);
  console.log(amount);
  console.log("DDDDDDDDDDD");
  let charge = {};
  try {
    charge = await stripe.charges.create({
      amount: amount,
      currency: "usd",
      source: tokenId,
      description: "My first payment",
    });
    console.log(charge, " charge");
  } catch (error) {
    charge.error = error.message;
  }
  return charge;
};
