import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from "@rneui/themed";

const UserAgreement = () => (
  <ScrollView style={styles.screen}>
    <View style={styles.paragraphArea}>
      <Text h4 >一、特别提示</Text>
      <Text style={styles.text}>        在此特别提醒您（用户）在注册成为众鼎人力用户之前，请认真阅读本《众鼎人力用户服务协议》（以下简称“协议”），确保您充分理解本协议中各条款。请您审慎阅读并选择接受或不接受本协议。您同意并点击确认本协议条款且完成注册程序后，才能成为众鼎人力的正式注册用户，并享受众鼎人力的各类服务。您的注册、登录、使用等行为将视为对本协议的接受，并同意接受本协议各项条款的约束。若您不同意本协议，或对本协议中的条款存在任何疑问，请您立即停止众鼎人力用户注册程序，并可以选择不使用本网站服务。本协议约定众鼎人力与用户之间关于“众鼎人力”软件（以下简称“服务”）的权利义务。“用户”是指注册、登录、使用本服务的个人、单位。本协议可由众鼎人力随时更新，更新后的协议条款一旦公布即代替原来的协议条款，恕不再另行通知，用户可在本软件中查阅最新版协议条款。在修改协议条款后，如果用户不接受修改后的条款，请立即停止使用众鼎人力提供的服务，用户继续使用众鼎人力提供的服务将被视为接受修改后的协议。</Text>
    </View>

    <View style={styles.paragraphArea}>
      <Text h4>二、账号注册</Text>
      <Text style={styles.text}>1、用户在使用本服务前需要注册一个“众鼎人力”账号。“众鼎人力”账号应当使用身份证号码认证的微信号注册，请用户使用尚未与“众鼎人力”账号绑定的微信号，以及未被众鼎人力根据本协议封禁的微信号注册“众鼎人力”账号。众鼎人力可以根据用户需求或产品需要对账号注册和绑定的方式进行变更，而无须事先通知用户。</Text>
      <Text style={styles.text}>2、如果注册申请者有被众鼎人力封禁的先例或涉嫌虚假注册及滥用他人名义注册，及其他不能得到许可的理由，众鼎人力将拒绝其注册申请。</Text>
      <Text style={styles.text}>3、鉴于“众鼎人力”账号的绑定注册方式，您同意众鼎人力在注册时将允许您的手机号码及手机设备识别码等信息用于注册。</Text>
      <Text style={styles.text}>4、在用户注册及使用本服务时，众鼎人力需要搜集能识别用户身份的个人信息以便众鼎人力可以在必要时联系用户，或为用户提供更好的使用体验。众鼎人力收集的信息包括但不限于用户的姓名、地址；</Text>
      <Text style={styles.text}>5、众鼎人力同意对这些信息的使用将受限于第三条用户个人隐私信息保护的约束。</Text>
    </View>

    <View style={styles.paragraphArea}>
      <Text h4>三、账户安全</Text>
      <Text style={styles.text}>1、用户一旦注册成功，成为众鼎人力的用户，将得到一个用户名，并有权利使用自己的用户名随时进行登陆众鼎人力程序。</Text>
      <Text style={styles.text}>2、用户对用户名的安全负全部责任，同时对以其用户名进行的所有活动和事件负全责。</Text>
      <Text style={styles.text}>3、用户不得以任何形式擅自转让或授权他人使用自己的众鼎人力用户名。</Text>
      <Text style={styles.text}>4、用户对个人账号加以妥善保管，切勿将个人账号告知他人，因个人账号保管不善而造成的所有损失由用户自行承担。</Text>
      <Text style={styles.text}>5、如果用户泄漏了账号，有可能导致不利的法律后果，因此不管任何原因导致用户的账号安全受到威胁，应该立即和众鼎人力客服人员取得联系，否则后果自负。</Text>
    </View>

    <View style={styles.paragraphArea}>
      <Text h4>四、用户声明与保证</Text>
      <Text style={styles.text}>1、用户承诺其为具有完全民事行为能力的民事主体，且具有达成交易履行其义务的能力。</Text>
      <Text style={styles.text}>2、用户有义务在注册时提供自己的真实资料，并保证诸如手机号码、姓名、所在地区等内容的有效性及安全性，保证众鼎人力工作人员可以通过上述联系方式与用户取得联系。同时，用户也有义务在相关资料实际变更时及时更新有关注册资料。</Text>
      <Text style={styles.text}>3、用户通过使用众鼎人力的过程中所制作、上载、复制、发布、传播的任何內容，包括但不限于账号头像、名称、用户说明等注册信息及认证资料，或文字、语音、图片、视频、图文等发送、回复和相关链接页面，以及其他使用账号或本服务所产生的内容，不得违反国家相关法律制度，包含但不限于如下原则: </Text>
      <Text style={styles.text_little}>(1)违反宪法所确定的基本原则的；</Text>
      <Text style={styles.text_little}>(2)危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</Text>
      <Text style={styles.text_little}>(3)损害国家荣誉和利益的；</Text>
      <Text style={styles.text_little}>(4)煽动民族仇恨、民族歧视，破坏民族团结的；</Text>
      <Text style={styles.text_little}>(5)破坏国家宗教政策，宣扬邪教和封建迷信的；</Text>
      <Text style={styles.text_little}>(6)散布谣言，扰乱社公秩序，破坏社会稳定的； </Text>
      <Text style={styles.text_little}>(7)散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</Text>
      <Text style={styles.text_little}>(8)侮辱或者诽谤他人，侵害他人合法权益的； </Text>
      <Text style={styles.text_little}>(9)含有法律、行政法规禁止的其他内容的。 </Text>
      <Text style={styles.text}>4、用户不得利用“众鼎人力”账号或本服务制作、上载、复制、发布、传播下干扰“众鼎人力”的正常运营，以及侵犯其他用户或第三方合法权益的内容：</Text>
      <Text style={styles.text_little}>(1)含有任何性或性暗示的；</Text>
      <Text style={styles.text_little}>(2)含有辱骂、恐吓、威胁内容的；</Text>
      <Text style={styles.text_little}>(3)含有骚扰、垃圾广告、恶意信息、诱骗信息的； </Text>
      <Text style={styles.text_little}>(4)涉及他人隐私、个人信息或资料的； </Text>
      <Text style={styles.text_little}>(5)侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的；</Text>
      <Text style={styles.text_little}>(6)宣扬邪教和封建迷信的；</Text>
      <Text style={styles.text_little}>(7)破坏社会稳定的；</Text>
      <Text style={styles.text_little}>(8)散布谣言，含有其他干扰本服务正常运营和侵犯其他用户或第三方合法权益内容的信息。</Text>
    </View>

    <View style={styles.paragraphArea}>
      <Text h4>五、服务内容</Text>
      <Text style={styles.text}>1、众鼎人力是由深圳市众鼎人力资源有限公司提供的线上求职服务平台，用户通过众鼎人力寻找到合适的务工企业后，委托众鼎人力负责提供各类用工企业岗位需求，为用户提供招聘信息，在招聘过程中提供招聘信息详情、面试休息区、输送面试服务，入职跟踪等服务。具体服务内容由众鼎人力根据实际情况提供，包括但不限于: </Text>
      <Text style={styles.text_little}>(1)在线搜索、发布招聘信息服务；</Text>
      <Text style={styles.text_little}>(2)招聘企业详情服务；</Text>
      <Text style={styles.text_little}>(3)面试接待、入职接待服务；</Text>
      <Text style={styles.text_little}>(4)订单查询。</Text>
      <Text style={styles.text}>2、众鼎人力有权随时审核或删除用户发布/传播的涉嫌违法或违反社会主义精神文明，或者被众鼎人力认为不妥当的内容(包括但不限于文字、语音、图片、视频图文等)。</Text>
      <Text style={styles.text}>3、用户通过众鼎人力完成的招聘入职后，招聘信息以平台发布的相应信息为准，入职应签署《用工协议》，该合同文本格式由众鼎人力提提供，用户入职前完成签订。 </Text>
      <Text style={styles.text}>4、所有发给用户的通告及其他消息都可通过软件或者用户所提供的联系方式发送。  </Text>
    </View>

    <View style={styles.paragraphArea}>
      <Text h4>六、服务的终止</Text>
      <Text style={styles.text}>1、在下列情况下众鼎人力有权终止向用户提供服务：</Text>
      <Text style={styles.text_little}>(1)在用户违反本服务协议相关规定时，众鼎人力有权终止向该用户提供服务；如该用户再一次直接或间接或以他人名义注册为用户的，一经发现，众鼎人力有权直接单方面终止向该用户提供服务；</Text>
      <Text style={styles.text_little}>(2)如众鼎人力通过用户提供的信息与用户联系时，发现用户在注册时填写的联系方式已不存在或无法接通，众鼎人力以其它联系方式通知用户更改，而用户在三个工作日内仍未能提供新的联系方式，众鼎人力有权终止向该用户提供服务；</Text>
      <Text style={styles.text_little}>(3)用户不得通过程序或人工方式进行刷量或作弊，若发现用户有作弊行为，众鼎人力将立即终止服务，并有权扣留账户内金额；</Text>
      <Text style={styles.text_little}>(4)一旦众鼎人力发现用户提供的数据或信息中含有虚假内容，众鼎人力有权随时终止向该用户提供服务；</Text>
      <Text style={styles.text_little}>(5)本服务条款终止或更新时，用户明示不愿接受新的服务条款；</Text>
      <Text style={styles.text_little}>(6)以及其他众鼎人力认为需要终止服务的情况。 </Text>
      <Text style={styles.text}>2、服务终止后，众鼎人力没有义务为用户保留原账号中或与之相关的任何信息，或转发任何未曾阋读或发送的信息给用户或第三方。</Text>
      <Text style={styles.text}>3、用户理解并同意，即便在本协议终止及用户的服务被终止后，众鼎人力仍有权： </Text>
      <Text style={styles.text_little}>(1)继续续保存您的用户信息；</Text>
      <Text style={styles.text_little}>(2)继续向用户主张在其使用众鼎人力公众号平台服务期间因违反法律法规、本协议及平台规则而应承担的责任。</Text>
    </View>

    <View style={styles.paragraphArea}>
      <Text h4>七、服务的变更、中断</Text>
      <Text style={styles.text}>1、鉴于网络服务的特殊性，用户需同意众鼎人力会变更、中断部分或全部的网络服务，并删除（不再保存）用户在使用过程中提交的任何资料，而无需通知用户，也无需对任何用户或任何第三方承担任何责任。</Text>
      <Text style={styles.text}>2、众鼎人力需要定期或不定期地对提供网络服务的平台进行检测或者更新，如因此类情况而造成网络服务在合理时间内的中断，众鼎人力无需为此承担任何责任。</Text>
    </View>

    <View style={styles.paragraphArea}>
      <Text h4>八、服务条款修改</Text>
      <Text style={styles.text}>1、众鼎人力有权随时修改本服务条款的任何内容，一旦本服务条款的任何内容发生变动，众鼎人力将会通过适当方式向用户提示修改内容。</Text>
      <Text style={styles.text}>2、如果不同意众鼎人力对本服务条款所做的修改，用户有权停止使用网络服务。</Text>
      <Text style={styles.text}>3、如果用户继续使用网络服务，则视为用户接受众鼎人力对本服务条款所做的修改。</Text>
    </View>

    <View style={styles.paragraphArea}>
      <Text h4>九、免责与赔偿声明</Text>
      <Text style={styles.text}>1、若众鼎人力已经明示其服务提供方式发生变更并提醒用户应当注意事项，用户未按要求操作所产生的一切后果由用户自行承担。</Text>
      <Text style={styles.text}>2、用户明确同意其使用众鼎人力所存在的风险将完全由其自己承担，因其使用众鼎人力而产生的一切后果也由其自己承担。 </Text>
      <Text style={styles.text}>3、用户同意保障和维护众鼎人力及其他用户的利益，由于用户在使用众鼎人力有违法、不真实、不正当、侵犯第三方合法权益的行为，或用户违反本协议项下的任何条款而给众鼎人力及任何其他第三方造成损失，用户同意承担由此造成的损害赔偿责任。 </Text>
    </View>

    <View style={styles.paragraphArea}>
      <Text h4>十、隐私声明</Text>
      <Text style={styles.text}>1、适用范围：</Text>
      <Text style={styles.text_little}>(1)在用户注册众鼎人力账户时，根据要求提供的个人注册信息；</Text>
      <Text style={styles.text_little}>(2)在用户使用众鼎人力或访问其相关网页时，众鼎人力自动接收并记录的用户浏览器上的服务器数值，包括但不限于IP地址等数据及用户要求取用的网页记录。 </Text>
      <Text style={styles.text}>2、信息使用： </Text>
      <Text style={styles.text_little}>(1)众鼎人力不会向任何人出售或出借用户的个人信息，除非事先得到用户的许可； </Text>
      <Text style={styles.text_little}>(2)众鼎人力亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播用户的个人信息，任何用户如从事上述活动，一经发现，众鼎人力有权立即终止与该用户的服务协议，查封其账号； </Text>
      <Text style={styles.text_little}>(3)为达到服务用户的目的，众鼎人力可能通过使用用户的个人信息，向用户提供服务，包括但不限于向用户发出产品和服务信息，或者与众鼎人力合作伙伴共享信息以便他们向用户发送有关其产品和服务的信息。</Text>
      <Text style={styles.text}>3、信息披露：用户的个人信息将在下述情況下部分或全部被披露： </Text>
      <Text style={styles.text_little}>(1)经用用户同意，向第三方披露；  </Text>
      <Text style={styles.text_little}>(2)根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露；</Text>
      <Text style={styles.text_little}>(3)如果用户出现违反中国有关法律或者网站政策的情况，需要向第三方披露；</Text>
      <Text style={styles.text_little}>(4)为提供用户所要求的产品和服务，而必须和第三方分享用户的个人信息；</Text>
      <Text style={styles.text_little}>(5)其它众鼎人力根据法律或者网站政策认为合适的披露；</Text>
      <Text style={styles.text_little}>(6)用户使用众鼎人力时提供的银行账户信息，众鼎人力将严格履行关保密约定。</Text>
    </View>

    <View style={[styles.paragraphArea, styles.lastParagraphArea]}>
      <Text h4>十一、其他</Text>
      <Text style={styles.text}>1、众鼎人力郑重提醒用户注意本协议中免除众鼎人力来责任和和限制用户权利的条款，请用户仔细阅读，自主考虑风险。未成年人应在法定监护人的陪同下阅读本协议。</Text>
      <Text style={styles.text}>2、本协议的效力、解释及纠纷的解决，适用于中华人民共和国法律。若用户和众鼎人力之间发生任何纠纷或争议，首先应友好协商解决，协商不成的，用户同意将纠纷或争议提交众鼎人力住所地有管辖权的人民法院管辖。</Text>
      <Text style={styles.text}>3、本协议的任何条款无论因何种原因无效或不具可执行性，其余条款仍有效，对双方具有约束力。</Text>
      <Text style={styles.text}>4、本协议最终解释权归深圳市众鼎人力资源有限公司所有，并且保留一切解释和修改的权力。</Text>
      <Text style={styles.text}>5、本协议自2021年7月7日起适用。</Text>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  paragraphArea: {
    marginHorizontal: 15,
    marginTop: 20
  },
  text: {
    marginTop: 10
  },
  text_little: {
    marginTop: 10,
    paddingLeft: 13,
    fontSize: 13
  },
  lastParagraphArea: {
    marginBottom: 20
  }
});

export default UserAgreement;
