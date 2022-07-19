import { Component, OnInit } from '@angular/core';
import { NgxMasonryOptions } from 'ngx-masonry';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss'],
})
export class RepositoryComponent implements OnInit {
  repository_titles: any[][] = [
    [
      'Forward',
      'Forward Title',
      'Document',
      ['A large dictionary of the names of the victims in 1957'],
    ],
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
    ],
  ];

  selectedCategory: string = this.repository_titles[0][0];
  constructor() {}

  downloadCont = [
    {
      name: 'Forward files',
      filename: 'A large dictionary of the names of the victims in 1957',
    },
  ];

  ngOnInit(): void {}

  setActive(gallery: string) {
    this.selectedCategory = gallery;
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
