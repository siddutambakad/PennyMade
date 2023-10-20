import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Logo from '../assets/images/logo1.svg';
import Shoppingcart from '../assets/images/shopping-cart.svg';
import Menu from '../assets/images/menu.svg';
import Dropdowns from './componet/Dropdowns';
import {CategoriesContext} from './componet/AppContext';
import axios from 'axios';
import {APIS} from '../src/configs/apiUrls';
import Loader from './componet/Loader/Loader';
import Footer from './componet/Footer';

// import HTMLView from 'react-native-htmlview';

const ContactUs = ({navigation}) => {
  const {contextCategories, getSubCatagories} = useContext(CategoriesContext);
  const [isOpen, setIsOpen] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [category, setCategory] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getContactUs();
  }, []);
  const getContactUs = async () => {
    setLoader(true);
    const contactApi = `${APIS.getContactDetails}`;
    try {
      const contactResponse = await axios.get(contactApi);
      setContactData(contactResponse?.data);
      setLoader(false);
      // console.log('responsce contact', contactResponse?.data);
    } catch (error) {
      console.log('contactUsError', error);
      setLoader(false);
    }
  };
  const getName = category => {
    ///so in product detail api we are getting category id .. so getting name based on category id
    if (category) {
      let data = contextCategories.filter(item => item.category == category);
      return data[0].name;
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/bacgroundImage.jpg')}
      style={styles.imageBacground}>
      <View style={styles.header}>
        <View style={{}}>
          <Logo width={180} height={25} />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.pressableImage}
            onPress={() => {
              navigation.navigate('CartScreen');
            }}>
            <Shoppingcart width={22} height={22} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{paddingLeft: 10}}
            onPress={() => navigation.openDrawer()}>
            <Menu width={43} height={43} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginHorizontal: 15, marginVertical: 10}}>
        <Dropdowns
          initialText={'Choose collectables'}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 13,
            alignItems: 'center',
            borderRadius: 5,
            width: 240,
          }}
          customOptionStyles={{
            backgroundColor: 'white',
            width: 240,
            height: 150,
            borderWidth: 1,
            borderColor: '#873900',
            elevation: 10,
            zIndex: 10,
            position: 'absolute',
            borderRadius: 3,
            top: 53,
          }}
          isGradient={true}
          options={contextCategories}
          handleClick={async item => {
            setLoader(true);
            const id = item?.category;
            setCategory(id);

            if (id) {
              await getSubCatagories(id);
              setLoader(false);
            }
            navigation.navigate('CatalougePage', {
              books: {category: id, name: getName(item.category)},
            });
          }}
          isClicked={isOpen}
          setIsClicked={() => {
            setIsOpen(!isOpen);
          }}
        />
      </View>
      <ScrollView>
        <View style={{marginHorizontal: 15}}>
          {contactData.data && (
            <View style={{paddingHorizontal: 5}}>
              <Text style={styles.boldText}>
                Pennymead Auctions and Books. Proprietor David Druett. VAT Reg.
                No. 355701208
              </Text>
              <View style={{marginVertical: 15}}>
                <Text style={styles.boldText1}>1 Brewerton Street</Text>
                <Text style={styles.boldText2}>Knaresborough</Text>
                <Text style={styles.boldText3}>North Yorkshire</Text>
                <Text style={styles.boldText4}>HG5 8AZ</Text>
              </View>
              <Text style={styles.boldText5}>
                <Text style={styles.boldText7}>Telephone : </Text> 01423 865962
                |
              </Text>
              <Text style={styles.boldText6}>
                <Text style={styles.boldText8}>E-mail : </Text>pennymead@aol.com
                or pennymeadbooks at hotmail.co.uk
              </Text>
              <Text style={styles.description}>
                Pennymead Auctions/Books is a one-man business which I started
                in 1982. I trade from my home in Knaresborough and welcome
                customers by appointment.
              </Text>
            </View>
          )}
          {contactData.data && (
            <View style={{paddingHorizontal: 5}}>
              <Text style={styles.termsText}>Terms of Business</Text>
              <Text style={styles.description}>
                All goods are described accurately and in good faith. Any found
                not to be as described may be returned for a full refund.
              </Text>
              <Text style={styles.termsText}>Shipping</Text>
              <Text style={styles.description}>
                Postage and packing are charged as an extra but this includes
                insurance cover while in transit.
              </Text>
              <Text style={styles.description}>
                Stamps, covers and postcards have a flat rate postage charge.
                You may order as many as you wish and the charges will remain as
                follows:- Inland £1 Europe £2 Worldwide £2.50{' '}
              </Text>
              <Text style={styles.description}>
                On orders of books and maps I will advise the shipping cost
                having weighed the items. This will be at cost + £1 for packing
                materials. An invoice will then be sent for the total amount. If
                this proves unacceptable please advise and the order will be
                cancelled.
              </Text>
              <Text style={styles.termsText}>Payment</Text>
              <Text style={styles.description}>
                Payment can be made by credit or debit card (except AMEX) or by
                Sterling cheque or U.S. or Canadian dollar cheque or in Euros in
                cash. (Credit card transactions are handled by Sage Pay directly
                - a link will be given to take you to their site)
              </Text>
              <Text style={styles.termsText}>Cancellations</Text>
              <Text style={styles.description}>
                Orders may be cancelled without penalty before dispatch. Please
                send an e mail to let me know you have changed your mind.
              </Text>
              <Text style={styles.termsText}>Delivery</Text>
              <Text style={styles.description}>
                Orders will be dispatched within two working days of receipt of
                payment.
              </Text>
              <Text style={styles.termsText}>Privacy policy</Text>
              <Text style={styles.description}>
                This privacy policy sets out how pennymead.com uses and protects
                any information that you give pennymead.com when you use this
                website. Pennymead.com is committed to ensuring that your
                privacy is protected. Should we ask you to provide certain
                information by which you can be identified when using this
                website, then you can be assured that it will only be used in
                accordance with this privacy statement.
              </Text>
              <Text style={styles.description}>
                Pennymead.com may change this policy from time to time by
                updating this page. You should check this page from time to time
                to ensure that you are happy with any changes. This policy is
                effective from 26 April 2012.
              </Text>
              <Text style={styles.termsText}>What we collect</Text>
              <Text style={styles.description}>
                We may collect the following information:
              </Text>
              <Text style={styles.description}>
                name \tand job title contact information \tincluding email
                address demographic information \tsuch as postcode, preferences
                and interests other information \trelevant to customer surveys
                and/or offers What we do with the information we gather We
                require this information to understand your needs and provide
                you with a better service, and in particular for the following
                reasons: Internal \trecord keeping. We may use the \tinformation
                to improve our products and services. We may \tperiodically send
                promotional emails about new products, special offers \tor other
                information which we think you may find interesting using \tthe
                email address which you have provided.
              </Text>
              <Text style={styles.termsText}>Security</Text>
              <Text style={styles.description}>
                We are committed to ensuring that your information is secure. In
                order to prevent unauthorised access or disclosure, we have put
                in place suitable physical, electronic and managerial procedures
                to safeguard and secure the information we collect online.
              </Text>
              <Text style={styles.termsText}>How we use cookies</Text>
              <Text style={styles.description}>
                A cookie is a small file which asks permission to be placed on
                your computer's hard drive. Once you agree, the file is added
                and the cookie helps analyse web traffic or lets you know when
                you visit a particular site. Cookies allow web applications to
                respond to you as an individual. The web application can tailor
                its operations to your needs, likes and dislikes by gathering
                and remembering information about your preferences.
              </Text>
              <Text style={styles.description}>
                We use traffic log cookies to identify which pages are being
                used. This helps us analyse data about web page traffic and
                improve our website in order to tailor it to customer needs. We
                only use this information for statistical analysis purposes and
                then the data is removed from the system.
              </Text>
              <Text style={styles.description}>
                Overall, cookies help us provide you with a better website, by
                enabling us to monitor which pages you find useful and which you
                do not. A cookie in no way gives us access to your computer or
                any information about you, other than the data you choose to
                share with us. You can choose to accept or decline cookies. Most
                web browsers automatically accept cookies, but you can usually
                modify your browser setting to decline cookies if you prefer.
                This may prevent you from taking full advantage of the website.
              </Text>
              <Text style={styles.termsText}>Links to other websites</Text>
              <Text style={styles.description}>
                Our website may contain links to other websites of interest.
                However, once you have used these links to leave our site, you
                should note that we do not have any control over that other
                website. Therefore, we cannot be responsible for the protection
                and privacy of any information which you provide whilst visiting
                such sites and such sites are not governed by this privacy
                statement. You should exercise caution and look at the privacy
                statement applicable to the website in question.
              </Text>
              <Text style={styles.description}>
                Controlling your personal information
              </Text>
              <Text style={styles.description}>
                You may choose to restrict the collection or use of your
                personal information in the following ways:
              </Text>
              <Text style={styles.description}>
                whenever \tyou are asked to fill in a form on the website, look
                for the box \tthat you can click to indicate that you do not
                want the information \tto be used by anybody for direct
                marketing purposes
              </Text>

              <Text style={styles.description}>
                if you have \tpreviously agreed to us using your personal
                information for direct \tmarketing purposes, you may change your
                mind at any time by writing \tto or emailing us at
                pennymead@aol.com
              </Text>
              <Text style={styles.description}>
                We will not sell, distribute or lease your personal information
                to third parties.
              </Text>

              <Text style={styles.description}>
                You may request details of personal information which we hold
                about you under the Data Protection Act 1998. A small fee will
                be payable. If you would like a copy of the information held on
                you please write to 1 Brewerton Street, Knaresborough, North
                Yorkshire, HG5 8AZ, UK.
              </Text>

              <Text style={styles.description}>
                If you believe that any information we are holding on you is
                incorrect or incomplete, please write to or email us as soon as
                possible, at the above address. We will promptly correct any
                information found to be incorrect.
              </Text>
              <Text style={styles.termsText}>The town of Knaresborough </Text>
              <Text style={styles.description}>
                The town of Knaresborough has plenty to offer visitors,
                particularly on warm summer days. It makes a good base to
                explore the Yorkshire Dales and cities of York and Leeds.
              </Text>
              <Text style={styles.description}>
                I can recommend a good hotel and also a very good B. & B. both
                in Knaresborough town centre, also several good pubs.{' '}
              </Text>

              <Text style={styles.description}>
                Callers are welcome to my home by appointment.
              </Text>

              <Text style={styles.description}>
                I have a small stock of books, prints and old postcards of
                Knaresborough for sale.
              </Text>
              <Text style={styles.footerText}>Sites about Knaresborough </Text>
              <Text style={styles.link}>http://www.knaresborough.co.uk/</Text>
            </View>
          )}
        </View>
        <Modal visible={showModal} animationType="fade" transparent={true}>
          <TouchableWithoutFeedback
            onPress={() => {
              setShowModal(false);
            }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  {'Ooops\nSomething Went Wrong!!\nPlease try again...'}
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setShowModal(false);
                  }}>
                  <Text style={styles.modalButtonText}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Footer />
      </ScrollView>
      {loader && <Loader />}
    </ImageBackground>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  imageBacground: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  pressableImage: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#873900',
    borderRadius: 50,
  },
  boldText: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'OpenSans-Regular',
    fontWeight: '600',
    // marginVertical: 15,
    textAlign: 'justify',
  },
  boldText1: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'OpenSans-Regular',
    fontWeight: '600',
  },
  boldText2: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'OpenSans-Regular',
    fontWeight: '600',
  },
  boldText3: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'OpenSans-Regular',
    fontWeight: '600',
  },
  boldText4: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'OpenSans-Regular',
    fontWeight: '600',
  },
  boldText7: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    fontWeight: 'bold',
    color: '#000000',
  },
  boldText8: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'justify',
  },
  boldText5: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'OpenSans-Regular',
    fontWeight: '600',
  },
  boldText6: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'OpenSans-Regular',
    fontWeight: '600',
    marginVertical: 15,
  },
  description: {
    marginVertical: 8,
    textAlign: 'justify',
    fontSize: 14,
    color: '#000000',
    fontFamily: 'OpenSans-Regular',
    fontWeight: '600',
  },
  termsText: {
    marginVertical: 8,
    fontSize: 16,
    color: 'black',
    fontFamily: 'RobotoSlab-Regular',
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 10,
  },
  link: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 10,
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#818589cc',
  },
  modalContent: {
    backgroundColor: '#FFF8F2',
    borderRadius: 8,
    height: 200,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    color: '#454545',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalButtonText: {
    color: '#FFF8F2',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButton: {
    backgroundColor: '#873900',
    borderRadius: 3,
    width: 100,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
});
