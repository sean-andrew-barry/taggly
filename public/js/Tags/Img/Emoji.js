import {Tag} from "/js/Tag.js";
import {Img} from "/js/Tags/Img.js";
import {Style} from "/js/Tags/Style.js";
import {CSS} from "/js/Tags/CSS.js";

const UFE0Fg = /\uFE0F/g;
const U200D = String.fromCharCode(8205);

export class Emoji extends Img
{
  // static GetLocalName(){ return "emoji"; }
  static GetMetaURL(){ return import.meta.url; }
  static GetEmojiBase(){ return "https://twemoji.maxcdn.com/v/13.0.1/"; }
  static GetEmojiExtension(){ return ".png"; }
  static GetEmojiSize(){ return "72x72"; }

  static ToCodePoint(string, sep = "-")
  {
    let p;

    const result = [];
    for (let i = 0; i < string.length; i++)
    {
      const c = string.charCodeAt(i);

      if (p)
      {
        result.push((65536 + (p - 55296 << 10) + (c - 56320)).toString(16));
        p = 0;
      }
      else if (55296 <= c && c <= 56319)
      {
        p = c;
      }
      else
      {
        result.push(c.toString(16));
      }
    }

    return result.join(sep);
  }

  static FindIcon(text)
  {
    return this.ToCodePoint(text.indexOf(U200D) < 0 ? text.replace(UFE0Fg, "") : text);
  }

  static Grinning(){ return new this(0x1f600); }
  static Smiley(){ return new this(0x1f603); }
  static GrinningWithBigEyes(){ return new this(0x1f603); }
  static GrinningWithSmilingEyes(){ return new this(0x1f604); }
  static Grin(){ return new this(0x1f604); }
  static BeamingWithSmilingEyes(){ return new this(0x1f601); }
  static GrinningSquinting(){ return new this(0x1f606); }
  static SweatSmile(){ return new this(0x1f605); }
  static SweatySmile(){ return new this(0x1f605); }
  static GrinningWithSweat(){ return new this(0x1f605); }
  static RollingOnTheFloorLaughing(){ return new this(0x1f923); }
  static FaceWithTearsOfJoy(){ return new this(0x1f602); }
  static Rofl(){ return new this(0x1f923); }
  static SlightSmile(){ return new this(0x1f642); }
  static SlightlySmiling(){ return new this(0x1f642); }
  static Smile(){ return new this(0x1f642); }
  static UpsideDown(){ return new this(0x1f643); }
  static Winking(){ return new this(0x1f609); }
  static SmilingWithSmilingEyes(){ return new this(0x1f60a); }
  static SmilingWithHalo(){ return new this(0x1f607); }
  static Innocent(){ return new this(0x1f607); }
  static SmilingFaceWithHearts(){ return new this(0x1f970); }
  static SmilingFaceWithHeartEyes(){ return new this(0x1f60d); }
  static StarStruck(){ return new this(0x1f929); }
  static FaceBlowingAKiss(){ return new this(0x1f618); }
  static Kissing(){ return new this(0x1f617); }
  static Smiling(){ return new this(0x263a); }
  static KissingWithClosedEyes(){ return new this(0x1f61a); }
  static KissingWithSmilingEyes(){ return new this(0x1f619); }
  static SmilingWithTear(){ return new this(0x1f972); }
  static FaceSavoringFood(){ return new this(0x1f60b); }
  static Tongue(){ return new this(0x1f445); }
  static StuckOutTongue(){ return new this(0x1f61b); }
  static WinkingWithTongue(){ return new this(0x1f61c); }
  static Zany(){ return new this(0x1f92a); }
  static SquintingWithTongue(){ return new this(0x1f61d); }
  static MoneyMouth(){ return new this(0x1f911); }
  static Hugging(){ return new this(0x1f917); }
  static HandOverMouth(){ return new this(0x1f92d); }
  static Shushing(){ return new this(0x1f92b); }
  static Thinking(){ return new this(0x1f914); }
  static ZipperMouth(){ return new this(0x1f910); }
  static RaisedEyebrow(){ return new this(0x1f928); }
  static Neutral(){ return new this(0x1f610); }
  static Expressionless(){ return new this(0x1f611); }
  static WithoutMouth(){ return new this(0x1f636); }
  static Smirking(){ return new this(0x1f60f); }
  static Unamused(){ return new this(0x1f612); }
  static RollingEyes(){ return new this(0x1f644); }
  static Grimacing(){ return new this(0x1f62c); }
  static Grimace(){ return new this(0x1f62c); }
  static Lying(){ return new this(0x1f925); }
  static Relieved(){ return new this(0x1f60c); }
  static Pensive(){ return new this(0x1f614); }
  static Sleepy(){ return new this(0x1f62a); }
  static Drooling(){ return new this(0x1f924); }
  static Sleeping(){ return new this(0x1f634); }
  static MedicalMask(){ return new this(0x1f637); }
  static Thermometer(){ return new this(0x1f912); }
  static HeadBandage(){ return new this(0x1f915); }
  static Nauseated(){ return new this(0x1f922); }
  static Vomiting(){ return new this(0x1f92e); }
  static Sneezing(){ return new this(0x1f927); }
  static Hot(){ return new this(0x1f975); }
  static Cold(){ return new this(0x1f976); }
  static Woozy(){ return new this(0x1f974); }
  static Dizzy(){ return new this(0x1f4ab); }
  static ExplodingHead(){ return new this(0x1f92f); }
  static Exploding(){ return new this(0x1f92f); }
  static CowboyHat(){ return new this(0x1f920); }
  static Ninja(){ return new this(0x1f977); }
  static Partying(){ return new this(0x1f973); }
  static Disguised(){ return new this(0x1f978); }
  static Sunglasses(){ return new this(0x1f60e); }
  static Nerd(){ return new this(0x1f913); }
  static Monocle(){ return new this(0x1f9d0); }
  static Confused(){ return new this(0x1f615); }
  static Worried(){ return new this(0x1f61f); }
  static SlightFrown(){ return new this(0x1f641); }
  static SlightlyFrowning(){ return new this(0x1f641); }
  static Frowning(){ return new this(0x2639); }
  static OpenMouth(){ return new this(0x1f62e); }
  static Hushed(){ return new this(0x1f62f); }
  static Astonished(){ return new this(0x1f632); }
  static Flushed(){ return new this(0x1f633); }
  static Pleading(){ return new this(0x1f97a); }
  static FrowningOpenMouth(){ return new this(0x1f626); }
  static Anguished(){ return new this(0x1f627); }
  static Fearful(){ return new this(0x1f628); }
  static AnxiousWithSweat(){ return new this(0x1f630); }
  static SadButRelieved(){ return new this(0x1f625); }
  static Crying(){ return new this(0x1f622); }
  static LoudlyCrying(){ return new this(0x1f62d); }
  static ScreamingInFear(){ return new this(0x1f631); }
  static Confounded(){ return new this(0x1f616); }
  static Persevering(){ return new this(0x1f623); }
  static Disappointed(){ return new this(0x1f61e); }
  static DowncastWithSweat(){ return new this(0x1f613); }
  static Weary(){ return new this(0x1f629); }
  static Tired(){ return new this(0x1f62b); }
  static Yawning(){ return new this(0x1f971); }
  static FaceWithSteamFromNose(){ return new this(0x1f624); }
  static PoutingFace(){ return new this(0x1f621); }
  static AngryFace(){ return new this(0x1f620); }
  static FaceWithSymbolsOnMouth(){ return new this(0x1f92c); }
  static SmilingFaceWithHorns(){ return new this(0x1f608); }
  static AngryFaceWithHorns(){ return new this(0x1f47f); }
  static Skull(){ return new this(0x1f480); }
  static SkullAndCrossbones(){ return new this(0x2620); }
  static PileOfPoo(){ return new this(0x1f4a9); }
  static ClownFace(){ return new this(0x1f921); }
  static Ogre(){ return new this(0x1f479); }
  static Goblin(){ return new this(0x1f47a); }
  static Ghost(){ return new this(0x1f47b); }
  static Alien(){ return new this(0x1f47d); }
  static AlienMonster(){ return new this(0x1f47e); }
  static Robot(){ return new this(0x1f916); }
  static GrinningCat(){ return new this(0x1f63a); }
  static GrinningCatWithSmilingEyes(){ return new this(0x1f638); }
  static CatWithTearsOfJoy(){ return new this(0x1f639); }
  static SmilingCatWithHeartEyes(){ return new this(0x1f63b); }
  static CatWithWrySmile(){ return new this(0x1f63c); }
  static KissingCat(){ return new this(0x1f63d); }
  static WearyCat(){ return new this(0x1f640); }
  static CryingCat(){ return new this(0x1f63f); }
  static PoutingCat(){ return new this(0x1f63e); }
  static SeeNoEvilMonkey(){ return new this(0x1f648); }
  static HearNoEvilMonkey(){ return new this(0x1f649); }
  static SpeakNoEvilMonkey(){ return new this(0x1f64a); }
  static KissMark(){ return new this(0x1f48b); }
  static LoveLetter(){ return new this(0x1f48c); }
  static HeartWithArrow(){ return new this(0x1f498); }
  static HeartWithRibbon(){ return new this(0x1f49d); }
  static SparklingHeart(){ return new this(0x1f496); }
  static GrowingHeart(){ return new this(0x1f497); }
  static BeatingHeart(){ return new this(0x1f493); }
  static RevolvingHearts(){ return new this(0x1f49e); }
  static TwoHearts(){ return new this(0x1f495); }
  static HeartDecoration(){ return new this(0x1f49f); }
  static HeartExclamation(){ return new this(0x2763); }
  static BrokenHeart(){ return new this(0x1f494); }
  static RedHeart(){ return new this(0x2764); }
  static Heart(){ return new this(0x2764); }
  static OrangeHeart(){ return new this(0x1f9e1); }
  static YellowHeart(){ return new this(0x1f49b); }
  static GreenHeart(){ return new this(0x1f49a); }
  static BlueHeart(){ return new this(0x1f499); }
  static PurpleHeart(){ return new this(0x1f49c); }
  static BrownHeart(){ return new this(0x1f90e); }
  static BlackHeart(){ return new this(0x1f5a4); }
  static WhiteHeart(){ return new this(0x1f90d); }
  static HundredPoints(){ return new this(0x1f4af); }
  static AngerSymbol(){ return new this(0x1f4a2); }
  static Collision(){ return new this(0x1f4a5); }
  static SweatDroplets(){ return new this(0x1f4a6); }
  static DashingAway(){ return new this(0x1f4a8); }
  static Hole(){ return new this(0x1f573); }
  static Bomb(){ return new this(0x1f4a3); }
  static SpeechBalloon(){ return new this(0x1f4ac); }
  static EyeInSpeechBubble(){ return new this(0x1f441); }
  static LeftSpeechBubble(){ return new this(0x1f5e8); }
  static RightAngerBubble(){ return new this(0x1f5ef); }
  static ThoughtBalloon(){ return new this(0x1f4ad); }
  static Zzz(){ return new this(0x1f4a4); }
  static WavingHand(){ return new this(0x1f44b); }
  static RaisedBackOfHand(){ return new this(0x1f91a); }
  static HandWithFingersSplayed(){ return new this(0x1f590); }
  static RaisedHand(){ return new this(0x270b); }
  static VulcanSalute(){ return new this(0x1f596); }
  static OKHand(){ return new this(0x1f44c); }
  static PinchedFingers(){ return new this(0x1f90c); }
  static PinchingHand(){ return new this(0x1f90f); }
  static VictoryHand(){ return new this(0x270c); }
  static CrossedFingers(){ return new this(0x1f91e); }
  static LoveYouGesture(){ return new this(0x1f91f); }
  static SignOfTheHorns(){ return new this(0x1f918); }
  static CallMeHand(){ return new this(0x1f919); }
  static BackhandIndexPointingLeft(){ return new this(0x1f448); }
  static BackhandIndexPointingRight(){ return new this(0x1f449); }
  static BackhandIndexPointingUp(){ return new this(0x1f446); }
  static MiddleFinger(){ return new this(0x1f595); }
  static BackhandIndexPointingDown(){ return new this(0x1f447); }
  static IndexPointingUp(){ return new this(0x261d); }
  static ThumbsUp(){ return new this(0x1f44d); }
  static ThumbsDown(){ return new this(0x1f44e); }
  static RaisedFist(){ return new this(0x270a); }
  static OncomingFist(){ return new this(0x1f44a); }
  static LeftFacingFist(){ return new this(0x1f91b); }
  static RightFacingFist(){ return new this(0x1f91c); }
  static ClappingHands(){ return new this(0x1f44f); }
  static RaisingHands(){ return new this(0x1f64c); }
  static OpenHands(){ return new this(0x1f450); }
  static PalmsUpTogether(){ return new this(0x1f932); }
  static Handshake(){ return new this(0x1f91d); }
  static FoldedHands(){ return new this(0x1f64f); }
  static WritingHand(){ return new this(0x270d); }
  static NailPolish(){ return new this(0x1f485); }
  static Selfie(){ return new this(0x1f933); }
  static FlexedBiceps(){ return new this(0x1f4aa); }
  static MechanicalArm(){ return new this(0x1f9be); }
  static MechanicalLeg(){ return new this(0x1f9bf); }
  static Leg(){ return new this(0x1f9b5); }
  static Foot(){ return new this(0x1f9b6); }
  static Ear(){ return new this(0x1f442); }
  static EarWithHearingAid(){ return new this(0x1f9bb); }
  static Nose(){ return new this(0x1f443); }
  static Brain(){ return new this(0x1f9e0); }
  static AnatomicalHeart(){ return new this(0x1fac0); }
  static Lungs(){ return new this(0x1fac1); }
  static Tooth(){ return new this(0x1f9b7); }
  static Bone(){ return new this(0x1f9b4); }
  static Eyes(){ return new this(0x1f440); }
  static Eye(){ return new this(0x1f441); }
  static Mouth(){ return new this(0x1f444); }
  static Baby(){ return new this(0x1f476); }
  static Child(){ return new this(0x1f9d2); }
  static Boy(){ return new this(0x1f469); }
  static Girl(){ return new this(0x1f469); }
  static Person(){ return new this(0x1f9d1); }
  static BlondHair(){ return new this(0x1f471); }
  static Man(){ return new this(0x1f468); }
  static Beard(){ return new this(0x1f9d4); }
  static RedHair(){ return new this(0x1f9b0); }
  static CurlyHair(){ return new this(0x1f9b1); }
  static WhiteHair(){ return new this(0x1f9b3); }
  static Bald(){ return new this(0x1f9b2); }
  static Woman(){ return new this(0x1f469); }
  static OlderPerson(){ return new this(0x1f9d3); }
  static OldMan(){ return new this(0x1f474); }
  static OldWoman(){ return new this(0x1f475); }
  static PersonFrowning(){ return new this(0x1f64d); }
  static ManFrowning(){ return new this(0x1f64d); }
  static WomanFrowning(){ return new this(0x1f64d); }
  static PersonPouting(){ return new this(0x1f64e); }
  static ManPouting(){ return new this(0x1f64e); }
  static WomanPouting(){ return new this(0x1f64e); }
  static PersonGesturingNO(){ return new this(0x1f645); }
  static ManGesturingNO(){ return new this(0x1f645); }
  static WomanGesturingNO(){ return new this(0x1f645); }
  static PersonGesturingOK(){ return new this(0x1f646); }
  static ManGesturingOK(){ return new this(0x1f646); }
  static WomanGesturingOK(){ return new this(0x1f646); }
  static PersonTippingHand(){ return new this(0x1f481); }
  static ManTippingHand(){ return new this(0x1f481); }
  static WomanTippingHand(){ return new this(0x1f481); }
  static PersonRaisingHand(){ return new this(0x1f64b); }
  static ManRaisingHand(){ return new this(0x1f64b); }
  static WomanRaisingHand(){ return new this(0x1f64b); }
  static DeafPerson(){ return new this(0x1f9cf); }
  static DeafMan(){ return new this(0x1f9cf); }
  static DeafWoman(){ return new this(0x1f9cf); }
  static PersonBowing(){ return new this(0x1f647); }
  static ManBowing(){ return new this(0x1f647); }
  static WomanBowing(){ return new this(0x1f647); }
  static PersonFacepalming(){ return new this(0x1f926); }
  static ManFacepalming(){ return new this(0x1f926); }
  static WomanFacepalming(){ return new this(0x1f926); }
  static PersonShrugging(){ return new this(0x1f937); }
  static ManShrugging(){ return new this(0x1f937); }
  static WomanShrugging(){ return new this(0x1f937); }
  static HealthWorker(){ return new this(0x1f9d1); }
  static ManHealthWorker(){ return new this(0x1f468); }
  static WomanHealthWorker(){ return new this(0x1f469); }
  static Student(){ return new this(0x1f9d1); }
  static ManStudent(){ return new this(0x1f468); }
  static WomanStudent(){ return new this(0x1f469); }
  static Teacher(){ return new this(0x1f9d1); }
  static ManTeacher(){ return new this(0x1f468); }
  static WomanTeacher(){ return new this(0x1f469); }
  static Judge(){ return new this(0x1f9d1); }
  static ManJudge(){ return new this(0x1f468); }
  static WomanJudge(){ return new this(0x1f469); }
  static Farmer(){ return new this(0x1f9d1); }
  static ManFarmer(){ return new this(0x1f468); }
  static WomanFarmer(){ return new this(0x1f469); }
  static Cook(){ return new this(0x1f9d1); }
  static ManCook(){ return new this(0x1f468); }
  static WomanCook(){ return new this(0x1f469); }
  static Mechanic(){ return new this(0x1f9d1); }
  static ManMechanic(){ return new this(0x1f468); }
  static WomanMechanic(){ return new this(0x1f469); }
  static FactoryWorker(){ return new this(0x1f9d1); }
  static ManFactoryWorker(){ return new this(0x1f468); }
  static WomanFactoryWorker(){ return new this(0x1f469); }
  static OfficeWorker(){ return new this(0x1f9d1); }
  static ManOfficeWorker(){ return new this(0x1f468); }
  static WomanOfficeWorker(){ return new this(0x1f469); }
  static Scientist(){ return new this(0x1f9d1); }
  static ManScientist(){ return new this(0x1f468); }
  static WomanScientist(){ return new this(0x1f469); }
  static Technologist(){ return new this(0x1f9d1); }
  static ManTechnologist(){ return new this(0x1f468); }
  static WomanTechnologist(){ return new this(0x1f469); }
  static Singer(){ return new this(0x1f9d1); }
  static ManSinger(){ return new this(0x1f468); }
  static WomanSinger(){ return new this(0x1f469); }
  static Artist(){ return new this(0x1f9d1); }
  static ManArtist(){ return new this(0x1f468); }
  static WomanArtist(){ return new this(0x1f469); }
  static Pilot(){ return new this(0x1f9d1); }
  static ManPilot(){ return new this(0x1f468); }
  static WomanPilot(){ return new this(0x1f469); }
  static Astronaut(){ return new this(0x1f9d1); }
  static ManAstronaut(){ return new this(0x1f468); }
  static WomanAstronaut(){ return new this(0x1f469); }
  static Firefighter(){ return new this(0x1f9d1); }
  static ManFirefighter(){ return new this(0x1f468); }
  static WomanFirefighter(){ return new this(0x1f469); }
  static PoliceOfficer(){ return new this(0x1f46e); }
  static ManPoliceOfficer(){ return new this(0x1f46e); }
  static WomanPoliceOfficer(){ return new this(0x1f46e); }
  static Detective(){ return new this(0x1f575); }
  static ManDetective(){ return new this(0x1f575); }
  static WomanDetective(){ return new this(0x1f575); }
  static Guard(){ return new this(0x1f482); }
  static ManGuard(){ return new this(0x1f482); }
  static WomanGuard(){ return new this(0x1f482); }
  static ConstructionWorker(){ return new this(0x1f477); }
  static ManConstructionWorker(){ return new this(0x1f477); }
  static WomanConstructionWorker(){ return new this(0x1f477); }
  static Prince(){ return new this(0x1f934); }
  static Princess(){ return new this(0x1f478); }
  static PersonWearingTurban(){ return new this(0x1f473); }
  static ManWearingTurban(){ return new this(0x1f473); }
  static WomanWearingTurban(){ return new this(0x1f473); }
  static ManWithSkullcap(){ return new this(0x1f472); }
  static WomanWithHeadscarf(){ return new this(0x1f9d5); }
  static ManInTuxedo(){ return new this(0x1f935); }
  static WomanInTuxedo(){ return new this(0x1f935); }
  static BrideWithVeil(){ return new this(0x1f470); }
  static ManWithVeil(){ return new this(0x1f470); }
  static WomanWithVeil(){ return new this(0x1f470); }
  static PregnantWoman(){ return new this(0x1f930); }
  static BreastFeeding(){ return new this(0x1f931); }
  static WomanFeedingBaby(){ return new this(0x1f469); }
  static ManFeedingBaby(){ return new this(0x1f468); }
  static PersonFeedingBaby(){ return new this(0x1f9d1); }
  static BabyAngel(){ return new this(0x1f47c); }
  static SantaClaus(){ return new this(0x1f385); }
  static Claus(){ return new this(0x1f936); }
  static MxClaus(){ return new this(0x1f9d1); }
  static Superhero(){ return new this(0x1f9b8); }
  static ManSuperhero(){ return new this(0x1f9b8); }
  static WomanSuperhero(){ return new this(0x1f9b8); }
  static Supervillain(){ return new this(0x1f9b9); }
  static ManSupervillain(){ return new this(0x1f9b9); }
  static WomanSupervillain(){ return new this(0x1f9b9); }
  static Mage(){ return new this(0x1f9d9); }
  static ManMage(){ return new this(0x1f9d9); }
  static WomanMage(){ return new this(0x1f9d9); }
  static Fairy(){ return new this(0x1f9da); }
  static ManFairy(){ return new this(0x1f9da); }
  static WomanFairy(){ return new this(0x1f9da); }
  static Vampire(){ return new this(0x1f9db); }
  static ManVampire(){ return new this(0x1f9db); }
  static WomanVampire(){ return new this(0x1f9db); }
  static Merperson(){ return new this(0x1f9dc); }
  static Merman(){ return new this(0x1f9dc); }
  static Mermaid(){ return new this(0x1f9dc); }
  static Elf(){ return new this(0x1f9dd); }
  static ManElf(){ return new this(0x1f9dd); }
  static WomanElf(){ return new this(0x1f9dd); }
  static Genie(){ return new this(0x1f9de); }
  static ManGenie(){ return new this(0x1f9de); }
  static WomanGenie(){ return new this(0x1f9de); }
  static Zombie(){ return new this(0x1f9df); }
  static ManZombie(){ return new this(0x1f9df); }
  static WomanZombie(){ return new this(0x1f9df); }
  static PersonGettingMassage(){ return new this(0x1f486); }
  static ManGettingMassage(){ return new this(0x1f486); }
  static WomanGettingMassage(){ return new this(0x1f486); }
  static PersonGettingHaircut(){ return new this(0x1f487); }
  static ManGettingHaircut(){ return new this(0x1f487); }
  static WomanGettingHaircut(){ return new this(0x1f487); }
  static PersonWalking(){ return new this(0x1f6b6); }
  static ManWalking(){ return new this(0x1f6b6); }
  static WomanWalking(){ return new this(0x1f6b6); }
  static PersonStanding(){ return new this(0x1f9cd); }
  static ManStanding(){ return new this(0x1f9cd); }
  static WomanStanding(){ return new this(0x1f9cd); }
  static PersonKneeling(){ return new this(0x1f9ce); }
  static ManKneeling(){ return new this(0x1f9ce); }
  static WomanKneeling(){ return new this(0x1f9ce); }
  static PersonWithProbingCane(){ return new this(0x1f9d1); }
  static ManWithProbingCane(){ return new this(0x1f468); }
  static WomanWithProbingCane(){ return new this(0x1f469); }
  static PersonInMotorizedWheelchair(){ return new this(0x1f9d1); }
  static ManInMotorizedWheelchair(){ return new this(0x1f468); }
  static WomanInMotorizedWheelchair(){ return new this(0x1f469); }
  static PersonInManualWheelchair(){ return new this(0x1f9d1); }
  static ManInManualWheelchair(){ return new this(0x1f468); }
  static WomanInManualWheelchair(){ return new this(0x1f469); }
  static PersonRunning(){ return new this(0x1f3c3); }
  static ManRunning(){ return new this(0x1f3c3); }
  static WomanRunning(){ return new this(0x1f3c3); }
  static WomanDancing(){ return new this(0x1f483); }
  static ManDancing(){ return new this(0x1f57a); }
  static ManInSuitLevitating(){ return new this(0x1f574); }
  static PeopleWithBunnyEars(){ return new this(0x1f46f); }
  static MenWithBunnyEars(){ return new this(0x1f46f); }
  static WomenWithBunnyEars(){ return new this(0x1f46f); }
  static PersonInSteamyRoom(){ return new this(0x1f9d6); }
  static ManInSteamyRoom(){ return new this(0x1f9d6); }
  static WomanInSteamyRoom(){ return new this(0x1f9d6); }
  static PersonClimbing(){ return new this(0x1f9d7); }
  static ManClimbing(){ return new this(0x1f9d7); }
  static WomanClimbing(){ return new this(0x1f9d7); }
  static PersonFencing(){ return new this(0x1f93a); }
  static HorseRacing(){ return new this(0x1f3c7); }
  static Skier(){ return new this(0x26f7); }
  static Snowboarder(){ return new this(0x1f3c2); }
  static PersonGolfing(){ return new this(0x1f3cc); }
  static ManGolfing(){ return new this(0x1f3cc); }
  static WomanGolfing(){ return new this(0x1f3cc); }
  static PersonSurfing(){ return new this(0x1f3c4); }
  static ManSurfing(){ return new this(0x1f3c4); }
  static WomanSurfing(){ return new this(0x1f3c4); }
  static PersonRowingBoat(){ return new this(0x1f6a3); }
  static ManRowingBoat(){ return new this(0x1f6a3); }
  static WomanRowingBoat(){ return new this(0x1f6a3); }
  static PersonSwimming(){ return new this(0x1f3ca); }
  static ManSwimming(){ return new this(0x1f3ca); }
  static WomanSwimming(){ return new this(0x1f3ca); }
  static PersonBouncingBall(){ return new this(0x26f9); }
  static ManBouncingBall(){ return new this(0x26f9); }
  static WomanBouncingBall(){ return new this(0x26f9); }
  static PersonLiftingWeights(){ return new this(0x1f3cb); }
  static ManLiftingWeights(){ return new this(0x1f3cb); }
  static WomanLiftingWeights(){ return new this(0x1f3cb); }
  static PersonBiking(){ return new this(0x1f6b4); }
  static ManBiking(){ return new this(0x1f6b4); }
  static WomanBiking(){ return new this(0x1f6b4); }
  static PersonMountainBiking(){ return new this(0x1f6b5); }
  static ManMountainBiking(){ return new this(0x1f6b5); }
  static WomanMountainBiking(){ return new this(0x1f6b5); }
  static PersonCartwheeling(){ return new this(0x1f938); }
  static ManCartwheeling(){ return new this(0x1f938); }
  static WomanCartwheeling(){ return new this(0x1f938); }
  static PeopleWrestling(){ return new this(0x1f93c); }
  static MenWrestling(){ return new this(0x1f93c); }
  static WomenWrestling(){ return new this(0x1f93c); }
  static PersonPlayingWaterPolo(){ return new this(0x1f93d); }
  static ManPlayingWaterPolo(){ return new this(0x1f93d); }
  static WomanPlayingWaterPolo(){ return new this(0x1f93d); }
  static PersonPlayingHandball(){ return new this(0x1f93e); }
  static ManPlayingHandball(){ return new this(0x1f93e); }
  static WomanPlayingHandball(){ return new this(0x1f93e); }
  static PersonJuggling(){ return new this(0x1f939); }
  static ManJuggling(){ return new this(0x1f939); }
  static WomanJuggling(){ return new this(0x1f939); }
  static PersonInLotusPosition(){ return new this(0x1f9d8); }
  static ManInLotusPosition(){ return new this(0x1f9d8); }
  static WomanInLotusPosition(){ return new this(0x1f9d8); }
  static PersonTakingBath(){ return new this(0x1f6c0); }
  static PersonInBed(){ return new this(0x1f6cc); }
  static PeopleHoldingHands(){ return new this(0x1f9d1); }
  static WomenHoldingHands(){ return new this(0x1f46d); }
  static WomanAndManHoldingHands(){ return new this(0x1f46b); }
  static MenHoldingHands(){ return new this(0x1f46c); }
  static Kiss(){ return new this(0x1f48f); }
  static CoupleWithHeart(){ return new this(0x1f491); }
  static Family(){ return new this(0x1f46a); }
  static SpeakingHead(){ return new this(0x1f5e3); }
  static BustInSilhouette(){ return new this(0x1f464); }
  static BustsInSilhouette(){ return new this(0x1f465); }
  static PeopleHugging(){ return new this(0x1fac2); }
  static Footprints(){ return new this(0x1f463); }
  static MonkeyFace(){ return new this(0x1f435); }
  static Monkey(){ return new this(0x1f412); }
  static Gorilla(){ return new this(0x1f98d); }
  static Orangutan(){ return new this(0x1f9a7); }
  static DogFace(){ return new this(0x1f436); }
  static Dog(){ return new this(0x1f415); }
  static GuideDog(){ return new this(0x1f9ae); }
  static ServiceDog(){ return new this(0x1f415); }
  static Poodle(){ return new this(0x1f429); }
  static Wolf(){ return new this(0x1f43a); }
  static Fox(){ return new this(0x1f98a); }
  static Raccoon(){ return new this(0x1f99d); }
  static CatFace(){ return new this(0x1f431); }
  static Cat(){ return new this(0x1f408); }
  static BlackCat(){ return new this(0x1f408); }
  static Lion(){ return new this(0x1f981); }
  static TigerFace(){ return new this(0x1f42f); }
  static Tiger(){ return new this(0x1f405); }
  static Leopard(){ return new this(0x1f406); }
  static HorseFace(){ return new this(0x1f434); }
  static Horse(){ return new this(0x1f40e); }
  static Unicorn(){ return new this(0x1f984); }
  static Zebra(){ return new this(0x1f993); }
  static Deer(){ return new this(0x1f98c); }
  static Bison(){ return new this(0x1f9ac); }
  static CowFace(){ return new this(0x1f42e); }
  static Ox(){ return new this(0x1f402); }
  static WaterBuffalo(){ return new this(0x1f403); }
  static Cow(){ return new this(0x1f404); }
  static PigFace(){ return new this(0x1f437); }
  static Pig(){ return new this(0x1f416); }
  static Boar(){ return new this(0x1f417); }
  static PigNose(){ return new this(0x1f43d); }
  static Ram(){ return new this(0x1f40f); }
  static Ewe(){ return new this(0x1f411); }
  static Goat(){ return new this(0x1f410); }
  static Camel(){ return new this(0x1f42a); }
  static TwoHumpCamel(){ return new this(0x1f42b); }
  static Llama(){ return new this(0x1f999); }
  static Giraffe(){ return new this(0x1f992); }
  static Elephant(){ return new this(0x1f418); }
  static Mammoth(){ return new this(0x1f9a3); }
  static Rhinoceros(){ return new this(0x1f98f); }
  static Hippopotamus(){ return new this(0x1f99b); }
  static MouseFace(){ return new this(0x1f42d); }
  static Mouse(){ return new this(0x1f401); }
  static Rat(){ return new this(0x1f400); }
  static Hamster(){ return new this(0x1f439); }
  static RabbitFace(){ return new this(0x1f430); }
  static Rabbit(){ return new this(0x1f407); }
  static Chipmunk(){ return new this(0x1f43f); }
  static Beaver(){ return new this(0x1f9ab); }
  static Hedgehog(){ return new this(0x1f994); }
  static Bat(){ return new this(0x1f987); }
  static Bear(){ return new this(0x1f43b); }

  static GetStyle()
  {
    return this.style ??= Style.Class("emoji").Inject("head").Append(
      new CSS("img.emoji")
      .DisplayInlineBlock()
      .Width("1.5em")
      .Height("1.5em")
      .Margin("0 0.05em 0 0.1em")
      .VerticalAlign("-0.1em"),
    );
  }

  constructor(src)
  {
    super().AddClass("emoji");

    this.constructor.GetStyle();

    if (src !== undefined)
    {
      this.Src(src);
    }
  }

  Code(code){ return this.SetAttribute("code", code); }
  GetCode(){ return this.GetAttribute("code"); }

  Src(src)
  {
    if (typeof(src) === "number") // Assume it's a code
    {
      const ctor = this.constructor;
      const code = String.fromCodePoint(src);
      src = `${ctor.GetEmojiBase()}${ctor.GetEmojiSize()}/${ctor.FindIcon(code)}${ctor.GetEmojiExtension()}`;
    }

    return super.Src(src);
  }

  Style()
  {
    return super.Style()
    .DisplayInlineBlock()
    .Width("1.5em")
    .Height("1.5em")
    .Margin("0 0.05em 0 0.1em")
    .VerticalAlign("-0.1em");
  }
}
