import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxMasonryOptions } from 'ngx-masonry';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss'],
})
export class RepositoryComponent implements OnInit {
  chinese_repository_titles: any[][] = [];
  pdf = { Foward: ['A large dictionary of the names of the victims in 1957'] };
  repository_titles: any[][] = [
    ['Forward', 'Forward Title', 'Document'],
    ['Publication Notes', ''],
    [
      'Appendix',
      'Title',
      'Document',
      [
        '200329References',
        '0200329References',
        'A Brief History of Yingjing Democratic League',
        'A glimpse of the five major labor camps in China',
        'A Summary of the Rectification Movement and Anti-Rightist Struggle in Ningshan County in 1957',
        'A Summary of the Rectification Movement and Anti-Rightist Struggle in Yunnan Province',
        'Chen Zongpei unveils the veil of contemporary Qin Shi Huang',
        'Criteria for dividing rightists by the Central Committee of the Communist Party of China',
        'Everyone on the Right This is a culture of destruction',
        'Fan_xing_µ¿èµÿƒ',
        'How much do the rightists know',
        'Hu Xinmin sees the 1957 anti-revolutionary',
        "Investigation report of the People's Procuratorate of Xinfeng County, Jiangxi Province on the situation of rightists in Jinpenshan Reclamation Farm",
        'Jiabiangou, Gansu',
        'Li Xin(Renmin University of China)Anti-rightist experience',
        'Li_linyaµ¥ÄΣ╕┤Θ¢à',
        'Lin Shengzhi Pingyang County, Zhejiang Province',
        "Lu Ping's report on dealing with rightists",
        'Luo Ruiqing report',
        'Mao Zedong things are changing Central Political Research Office',
        'Qian_liqun_ΘÆ▒τÉåτ╛ñ',
      ],
      [
        '0中共中央划分右派分子的标准',
        '0毛泽东事情正在起变化 中央政治研究室',
        '1罗瑞卿报告',
        '2云南省地县整风运动和反右派斗争综述',
        '3晓明广西省',
        '4杨金国河南省淇县',
        '5荥经民盟简史',
        '6宁陕县1957年整风运动和反右派斗争综述',
        '7林圣智浙江省平阳县',
        '8李新（中国人民大学）反右亲历记',
        '9施绍箕（上海交通大学）',
        '10吴中杰复旦往事',
        '11江西省信丰县人民检察院关于金盆山垦殖场右派分子情况调查报告',
        '12反右运动到底要整什么人',
        '13劳动教养和反右派斗争',
        '14中国五大劳改营掠影',
        '15陈宗培揭开当代秦始皇的面纱',
        '16陆平关于处理右派分子的报告',
        '17右派大家  这是一个毁灭文化',
        '18河南农场监狱的黒幕',
      ],
    ],
    [
      'Preface',
      'Preface Title',
      'Document',
      [
        'Foreword by Mr. Du Guang',
        'Foreword by Mr. Wan Xueren',
        'Foreword by Mr. Zhao Xu',
        'Foreword by Mr. Zhu Jianguo',
        'Inscription by Mr. Mao Yushi',
        'Letter from Mr. Feng Shiyan',
        'Letter from Mr. Wang Xuejian',
        'Letter from Mr. Yang Xijiu',
        'Letter from Mr. Zhang Qingyang',
        'Preface by Mr. Jin Zhong',
        'Preface by Mr. Pei Yiran',
        'Preface by Mr. Yang Jiao',
        'Professor Wei Xiezhong preface',
        'Quotes from Deng Xiaoping',
        'Text by Mr. Yan Changgui',
      ],
      [
        '万学仁先生序',
        '冯士彦先生信',
        '张清扬先生信',
        '朱健国先生序',
        '杜光先生序',
        '杨教先生序',
        '杨锡九先生信',
        '王学俭先生信',
        '茅于轼先生题词',
        '裴毅然先生序',
        '赵旭先生序',
        '邓小平语录',
        '金钟先生序',
        '阎长贵先生赐文',
        '魏燮中先生序',
      ],
    ],
  ];

  selectedCategory: string = this.repository_titles[0][0];

  currentLanguage = this.translate.currentLang;
  constructor(private translate: TranslateService) {
    console.log(this.currentLanguage);
    console.log(this.selectedCategory);
  }

  ngOnInit(): void {}

  setActive(gallery: string) {
    this.selectedCategory = gallery;
  }

  switchLanguage() {
    switch (this.currentLanguage) {
      case 'cn': {
        this.pdf = { Foward: ['一九五七年受难者姓名大辞典'] };
        break;
      }
      default: {
        this.pdf = {
          Foward: ['A large dictionary of the names of the victims in 1957'],
        };
      }
    }
  }

  downloadFromAsset(filename: string, folder: string) {
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = `assets/repositoryData/EnglishPDF/${folder}/${filename}.pdf`;

    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
