import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from "@rneui/themed";

const PrivacyPolicy = () => (
  <ScrollView style={styles.screen}>
    <View style={styles.paragraphArea}>
      <Text style={styles.text}>         隐私政策尊重并保护所有使用隐私政策网络服务用户的个人隐私权。为了给您提供更准确、更有个性化的服务，我们的隐私政策涵盖我们收集，使用，披露，传输和存储您的信息的方式。但隐私政策将以高度的勤勉、审慎义务对待这些信息。隐私政策会不时更新本隐私权政策。 您在同意隐私政策络服务使用协议之时，即视为您已经同意本隐私权政策全部内容。本隐私权政策属于隐私政策络服务使用协议不可分割的一部分。你不是一定要提供我们要求的个人信息，但在许多情况下，如果你选择不提供，我们将无法为你提供我们的产品或服务，也无法回应你遇到的任何问题。</Text>
    </View>

    <View style={styles.paragraphArea}>
      <Text h4>一、我们如何收集信息</Text>
      <Text style={styles.text}>        我们根据合法、正当、必要的原则，仅收集实现产品功能所必要的信息。我们公司收集个人信息的主要来源有：您提供的信息、在您使用我们产品或服务过程中获取的信息、第三方分享的您的信息。我们会出于如下产品功能的目的，收集和使用您的个人信息，如您不提供相关信息或不同意我们收集相关信息，您可能无法注册成为我们的用户或无法享受我们提供的某些服务，或无法达到好的服务效果。</Text>
      <Text style={styles.text}>1. 您提供账号注册、登录功能及服务，可能需要您提供如下账号注册信息：</Text>
      <Text style={styles.text_little}>(1)当您注册账号时，会向我们提供手机号码、登录密码。</Text>
      <Text style={styles.text_little}>(2)当您选择使用第三方账号登录的，我们会读取您在第三方账号注册时使用的头像、昵称信息。前述第三方账号包括QQ、微信、微博或其他第三方账号，以具体产品和服务实际接入的第三方账号为准。</Text>
      <Text style={styles.text_little}>(3)收集前述这些账号信息的目的在于：</Text>
      <Text style={styles.text_little_little}>1）通过账号管理更好地为您提供服务，通过登录账户，您可以同步您的相关信息。</Text>
      <Text style={styles.text_little_little}>2）如您提供真实有效的手机号码、QQ号、微博号、微信号进行绑定，当您遇到注册账号丢失、忘记密码问题时，可以便捷的找回账号和密码。</Text>
      <Text style={styles.text_little_little}>3）我们将对所收集的相关信息去标识化后进行统计分析，以便更加准确了解用户的习惯，并在此基础上不断改善产品、提高服务质量及改善产品用户使用体验。</Text>
      <Text style={styles.text}>2、您通过我们的客服或参加我们举办的活动时所提交的信息。为及时与您取得联系，反馈客服问题或相关活动信息，您可能会向我们提供您的联系方式，以便及时沟通。</Text>
      <Text style={styles.text}>3、设备信息</Text>
      <Text style={styles.text}>        设备信息，是指您使用我们产品或服务时使用的设备的信息。为了产品和服务与设备进行必要的适配及提供安全服务，您在使用产品或服务时，会收集您使用搜狗公司产品或服务的设备名称、设备型号、设备识别码、操作系统和应用程序版本、语言设置、分辨率、服务提供商网络ID（PLMN）相关信息。收集这些信息是为了帮助我们进行bug分析，保障您正常使用我们产品和服务、改进和优化我们的产品体验、保障您的账号安全。除本政策另有明确约定外，我们不会将您的设备信息提供给任何第三方。但我们无法保证其他第三方不会通过其他途径获知您设备信息、并将设备信息与其他信息相结合识别您个人身份的情况，由此造成您任何损失的，您应向第三方追偿。上述设备信息是为提供服务所收集的基础信息，如您不想设备信息被我们收集，则可能导致我们无法向您提供正常的服务。</Text>
      <Text style={styles.text}>4、位置信息</Text>
      <Text style={styles.text}>        位置信息，是指您开启设备定位功能并使用基于位置提供的相关服务时，收集的有关您位置的信息，主要包括：</Text>
      <Text style={styles.text_little}>(1)当您开启设备定位功能并使用相关产品或服务时，我们可能会使用GPS、WiFi或其他技术方式收集和处理有关您实际所在位置的信息。行踪轨迹、精准定位信息为个人敏感信息，除具体产品或服务功能所需外，我们的产品或服务不会收集该类个人敏感信息。</Text>
      <Text style={styles.text_little}>(2)您或其他用户提供的包含您所处地理位置的实时信息。包括您或其他人上传的显示您当前或曾经所处地理位置的共享信息，您或其他人共享的照片包含的地理标记信息。</Text>
      <Text style={styles.text_little}>(3)如您不想被访问，可以选择关闭设备或产品/服务中的相关功能，但可能会因此影响我们向您提供相关服务。</Text>
      <Text style={styles.text}>5、日志信息</Text>
      <Text style={styles.text}>        出于服务安全的必要，您使用产品和服务时，系统可能通过cookies或其他方式自动收集某些信息并存储在服务器日志中。此类信息可能包括：</Text>
      <Text style={styles.text_little}>(1)对我们的产品和服务的详细使用情况，此种信息可能包括您使用的网页搜索词语、访问的页面地址、以及您在使用服务时浏览或要求提供的其他信息和内容详情；设备或软件信息，除以上所述设备信息外，我们可能收集您使用的软件的版本号、浏览器类型。</Text>
      <Text style={styles.text_little}>(2)为确保您操作环境的安全或提供服务所需，我们会收集有关您使用的移动应用和其他软件的信息。</Text>
      <Text style={styles.text_little}>(3)设备事件信息，包括崩溃、系统活动信息及其他相关信息。</Text>
      <Text style={styles.text}>6、经您同意后收集的其他信息</Text>
      <Text style={styles.text}>        为向您提供更便捷、更优质、个性化的产品或服务，我们的部分产品和服务的个别特定功能可能需要您提供特定的个人敏感信息来实现。若您选择不提供该类信息，则可能无法正常使用对应功能，但不影响您使用服务中的其他功能。这些功能包括：</Text>
      <Text style={styles.text_little}>(1)基于摄像头（相机）的应用功能：您可在开启相机/摄像头权限后完成视频拍摄、拍照、扫码以及人脸识别的功能。未来我们可能会将人脸识别技术应用于更多场景，但那时我们会再次与您确认您是否愿意我们使用您的面部信息来实现这些扩展功能。</Text>
      <Text style={styles.text_little}>(2)基于相册（图片库/视频库）的图片/视频访问及上传的应用功能：您可在开启相册权限后使用对应功能对你的照片/图片/视频进行编辑处理。</Text>
      <Text style={styles.text_little}>(3)基于麦克风语音技术的应用功能：您可在开启麦克风权限后直接使用麦克风来进行录音或是实现对应的功能。在这些功能中我们会收集您的录音以识别您语音内容，实现对应的功能效果。</Text>
      <Text style={styles.text_little}>(4)基于通讯录信息的应用功能：我们将在您开启通讯录权限后收集您的通讯录信息，使你在使用对应功能时可以更便利的取用您通讯录内的联系人信息，无需再手动输入。</Text>
      <Text style={styles.text_little}>(5)基于日历的应用功能：我们将在您开启可读取/写入您日历的权限后，我们将收集您的日历信息用于备忘录记录及提醒。</Text>
      <Text style={styles.text_little}>(6)基于手机文件读取的应用功能：您可在开启文件读取/上传的权限后使用对应功能对手机内的文件进行编辑处理。</Text>
      <Text style={styles.text}>        您理解并同意，上述应用功能可能需要您在您的设备中向我们开启您的相机（摄像头）、相册（图片库）、麦克风（语音）、通讯录及日历的访问权限，以实现这些功能所涉及的信息的收集和使用。请您注意，收集个人敏感信息前，我们会以弹窗或类似显著方式获取您的同意。若您主动提供您的个人敏感信息，即表示您同意我们按本政策所述目的和方式来处理您的个人敏感信息。</Text>
      <Text style={styles.text}>7、其他第三方分享的您的信息</Text>
      <Text style={styles.text}>        主要包括两种情况：</Text>
      <Text style={styles.text_little}>(1)其他用户发布的信息中可能包含您的信息。</Text>
      <Text style={styles.text_little}>(2)您在使用第三方合作伙伴服务时所产生或分享的信息，当您使用微博、QQ账号及其他第三方账号登录我们的软件产品或服务时，我们需要核实您的身份或绑定您的账户信息，经过您的授权将相关账号关联到我们的产品或服务中。</Text>
    </View>

    <View style={styles.paragraphArea}>
      <Text h4>二、我们如何使用收集的信息</Text>
      <Text style={styles.text}>        我们严格遵守法律法规的规定及与用户的约定，将收集的信息用于以下用途。若我们超出以下用途使用您的信息，我们将再次向您进行说明，并征得您的同意。</Text>
      <Text style={styles.text_little}>(1)满足您的个性化需求 ：例如，语言设定、位置设定、个性化的帮助服务。</Text>
      <Text style={styles.text_little}>(2)向您提供服务，产品开发和服务优化 ：例如，当我们的系统发生故障时，我们会记录和分析系统故障时产生的信息，优化我们的服务。</Text>
      <Text style={styles.text_little}>(3)安全保障 ：例如，我们会将您的信息用于身份验证、安全防范、反诈骗监测、存档备份、客户的安全服务等用途。例如，您下载或安装的安全软件会对恶意程序或病毒进行检测，或为您识别诈骗信息。</Text>
      <Text style={styles.text_little}>(4)向您推荐您可能感兴趣的广告、资讯等。</Text>
      <Text style={styles.text_little}>(5)评估、改善我们的广告投放和其他促销及推广活动的效果。</Text>
      <Text style={styles.text_little}>(6)管理软件 ：例如，进行软件认证、软件升级等。</Text>
      <Text style={styles.text_little}>(7)邀请您参与有关我们服务的调查。</Text>
      <Text style={styles.text_little}>(8)根据法律法规在如下情形收集使用您的相关信息，此种情况下无须获得您的授权：</Text>
      <Text style={styles.text_little_little}>1）与国家安全、国防安全有关的；</Text>
      <Text style={styles.text_little_little}>2）与公共安全、公共卫生、重大公共利益有关的；</Text>
      <Text style={styles.text_little_little}>3）与犯罪侦查、起诉、审判和判决执行等有关的；</Text>
      <Text style={styles.text_little_little}>4）出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；</Text>
      <Text style={styles.text_little_little}>5）用于维护所提供的产品与/或服务的安全稳定运行所必需的，包括发现、处置产品与/或服务的故障等；</Text>
      <Text style={styles.text_little_little}>6）为合法的新闻报道所必需的；</Text>
      <Text style={styles.text_little_little}>7）学术研究机构基于公共利益开展统计或学术研究所必要，且对外提供学术研究或描述的结果时，对结果中所包含的个人信息进行去标识化处理的；</Text>
      <Text style={styles.text_little_little}>8）法律法规规定的其他情形。</Text>
      <Text style={styles.text_little}>(9)经您同意的其他用途。</Text>
      <Text style={styles.text}>        为了让您有更好的体验、改善我们的服务或经您同意的其他用途，在符合相关法律法规的前提下，我们可能将通过某些服务所收集的信息用于我们的其他服务。例如，将您在使用我们某项服务时的信息，用于另一项服务中向您展示个性化的内容或广告、用于用户研究分析与统计等服务。</Text>
      <Text style={styles.text}>        为了确保服务的安全，帮助我们更好地了解我们应用程序的运行情况，我们可能记录相关信息，例如，您使用应用程序的频率、故障信息、总体使用情况、性能数据以及应用程序的来源。我们不会将我们存储在分析软件中的信息与您在应用程序中提供的个人身份信息相结合。</Text>
    </View>

    <View style={styles.paragraphArea}>
      <Text h4>三、我们如何共享、转让、公开披露你的个人信息</Text>
      <Text style={styles.text}>        我们充分知晓因违法共享、转让、公开披露个人信息对个人信息主体造成损害时所应承担的法律责任，对于你的个人信息的一切共享、转让、公开披露，我们将严格按照以下条款进行：</Text>
      <Text style={styles.text}>（一）共享</Text>
      <Text style={styles.text}>        尊重用户个人隐私是我们的一项基本原则。除以下情形外，我们不会与任何公司、组织和个人分享你的个人信息：</Text>
      <Text style={styles.text_little}>(1)在获取明确同意的情况下共享：获得你的明确同意后，我们会与其他方共享你的个人信息。</Text>
      <Text style={styles.text_little}>(2)我们可能会按照司法机关或行政机关的要求，对外共享你的个人信息。</Text>
      <Text style={styles.text_little}>(3)与关联方共享：你的个人信息可能会与我们的关联公司共享。我们只会共享必要的个人信息，且受本隐私政策中所声明目的的约束。关联公司如要改变个人信息的处理目的，将再次征求你的授权同意。</Text>
      <Text style={styles.text_little}>(4)与授权合作伙伴共享：仅为实现本政策中声明的目的，我们的某些服务将由授权合作伙伴提供。我们可能会与合作伙伴共享你的某些个人信息，以提供更好的客户服务和用户体验。我们仅会出于合法、正当、必要、特定、明确的目的共享你的个人信息，并且只会共享提供服务所必要的个人信息，例如在你上网购买我们的产品时必须与物流公司共享你的信息。我们的合作伙伴无权将共享的个人信息用于任何其他用途。</Text>
      <Text style={styles.text}>        对我们与之共享个人信息的公司、组织和个人，我们会与其签署严格的保密协定，要求他们按照我们的说明、本隐私政策以及其他任何相关的保密和安全措施来处理个人信息。</Text>
      <Text style={styles.text}>（二）转让</Text>
      <Text style={styles.text}>        我们不会将你的个人信息转让给任何公司、组织和个人，但以下情况除外：</Text>
      <Text style={styles.text_little}>(1)在获取明确同意的情况下转让：获得你的明确同意后，我们会向其他方转让你的个人信息。</Text>
      <Text style={styles.text_little}>(2)在涉及合并、收购或破产清算时，如涉及到个人信息转让，我们会在要求新的持有你个人信息的公司、组织继续受此隐私政策的约束，否则我们将要求该公司、组织重新向你征求授权同意。</Text>
      <Text style={styles.text}>（三）公开披露</Text>
      <Text style={styles.text}>        我们仅会在以下情况下，公开披露你的个人信息：</Text>
      <Text style={styles.text_little}>(1)在您明确同意的披露方式下披露您所指定的个人信息</Text>
      <Text style={styles.text_little}>(2)根据法律、法规的要求、强制性的行政执法或司法要求所必须提供您个人信息的情况下，我们可能会依据所要求的个人信息类型和披露方式公开披露您的个人信息。在符合法律法规的前提下，当我们收到上述披露信息的请求时，我们会要求必须出具与之相应的法律文件，如传票或调查函。</Text>
    </View>

    <View style={styles.paragraphArea}>
      <Text h4>四、我们如何保护你的个人信息</Text>
      <Text style={styles.text_little}>(1)我们已使用符合业界标准的安全防护措施保护你提供的个人信息， 防止数据遭到未经授权访问、公开披露、使用、修改、损坏或丢失。我们会采取一切合理可行的措施，保护你的个人信息。例如，在你的浏览器与“服务”之间交换数据(如信用卡信息)时受SSL加密保护；我们同时对网站提供https安全浏览方式；我们会使用加密技术确保数据的保密性；我们会使用受信赖的保护机制防止数据遭到恶意攻击；我们会部署访问控制机制，确保只有授权人员才可访问个人信息；以及我们会举办安全和隐私保护培训课程，加强员工对于保护个人信息重要性的认识。</Text>
      <Text style={styles.text_little}>(2)我们会采取一切合理可行的措施，确保未收集无关的个人信息。除非取得你的书面许可，我们将在且仅在你删除或注销账户后36个月保留你的个人信息， 超出此期限后，我们将会对你的个人信息进行匿名化处理或销毁。</Text>
      <Text style={styles.text_little}>(3)互联网并非绝对安全的环境，而且电子邮件、即时通讯、及与其他用户的交流方式并未加密，我们强烈建议你不要通过此类方式发送个人信息。请使用复杂密码，协助我们保证你的账号安全。</Text>
      <Text style={styles.text_little}>(4)互联网环境并非百分之百安全，我们将尽力确保或担保你发送给我们的任何信息的安全性。如果我们的物理、技术、或管理防护设施遭到破坏，导致信息被非授权访问、公开披露、篡改、或毁坏，导致你的合法权益受损，我们将承担相应的法律责任。</Text>
      <Text style={styles.text_little}>(5)在不幸发生个人信息安全事件后，我们将按照《网络安全法》第42条第二款之规定及时向你告知：安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、你可自主防范和降低风险的建议、对你的补救措施等。我们将及时将事件相关情况以邮件、信函、电话、推送通知等方式告知你，难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。同时，我们还将按照监管部门要求，主动上报个人信息安全事件的处置情况。</Text>
    </View>

    <View style={styles.paragraphArea}>
      <Text h4>五、您如何管理您的个人信息</Text>
      <Text style={styles.text_little}>(1)您可以在使用我们服务的过程中，访问、修改和删除您提供的注册信息和其他个人信息，也可按照通知指引与我们联系。您访问、修改和删除个人信息的范围和方式将取决于您使用的具体服务。</Text>
      <Text style={styles.text}>        例如，若您在使用地理位置相关服务时，希望停止分享您的地理位置信息，您可通过手机定位关闭功能、软硬件服务商及通讯服务提供商的关闭方式停止分享，建议您仔细阅读相关指引。</Text>
      <Text style={styles.text_little}>(2)我们将按照本政策所述，仅为实现我们产品或服务的功能，收集、使用您的信息。如您发现我们违反法律、行政法规的规定或者双方的约定收集、使用您的个人信息，您可以要求我们删除。如您发现我们收集、存储的您的个人信息有错误的，您也可以要求我们更正。在您访问、修改和删除相关信息时，我们可能会要求您进行身份验证，以保障帐号的安全。</Text>
      <Text style={styles.text_little}>(3)在以下情形中，按照法律法规要求，我们将无法响应你的请求：</Text>
      <Text style={styles.text_little_little}>1）与国家安全、国防安全直接相关的；</Text>
      <Text style={styles.text_little_little}>2）与公共安全、公共卫生、重大公共利益直接相关的；</Text>
      <Text style={styles.text_little_little}>3）与犯罪侦查、起诉、审判和判决执行等直接相关的；</Text>
      <Text style={styles.text_little_little}>4）有充分证据表明你存在主观恶意或滥用权利的；</Text>
      <Text style={styles.text_little_little}>5）响应你的请求将导致你或其他个人、组织的合法权益受到严重损害的；</Text>
      <Text style={styles.text_little_little}>6）涉及商业秘密的。</Text>
    </View>

    <View style={styles.paragraphArea}>
      <Text h4>六、关于儿童的个人信息</Text>
      <Text style={styles.text}>        我们的产品、网站和服务主要面向成人。如果没有父母或监护人的同意，未成年人不得创建自己的用户账户。</Text>
      <Text style={styles.text}>        对于经父母同意而收集未成年个人信息的情况，我们只会在司法机关或行政机关要求、父母或监护人明确同意或者保护未成年人所必要的情况下使用或公开披露此信息。</Text>
      <Text style={styles.text}>        尽管当地法律和习俗对未成年人的定义不同，但我们将不满 16 周岁的任何人均视为未成年人。如果我们发现自己在未事先获得可证实的父母同意的情况下收集了未成年人的个人信息，则会设法尽快删除相关数据。</Text>
      <Text style={styles.text}>        如果我们发现自己在未事先获得可证实的父母同意的情况下收集了未成年人的个人信息，则会设法尽快删除相关数据。</Text>
    </View>

    <View style={[styles.paragraphArea, styles.lastParagraphArea]}>
      <Text h4>七、本政策如何更新</Text>
      <Text style={styles.text}>        我们的隐私政策将不定时更新。通常情况下，我们不会削减你按照本隐私政策所应享有的权利。</Text>
      <Text style={styles.text}>        我们会在本页面上发布更新后的版本并且以弹框或与弹框同等显著的方式通知你本政策所做的任何变更，你同意后，即表示同意受经修订的本政策的约束。</Text>
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
  text_little_little: {
    marginTop: 5,
    paddingLeft: 25,
    fontSize: 13
  },
  lastParagraphArea: {
    marginBottom: 20
  }
});

export default PrivacyPolicy;
