import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';

import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { jsPDF } from 'jspdf';
import { ClipboardService } from 'ngx-clipboard';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';
import {NotoSansFont} from 'src\app\share\Noto_Sans_SC';

@Component({
  selector: 'app-browse-archive',
  templateUrl: './browse-archive.component.html',
  styleUrls: ['./browse-archive.component.scss'],
})
export class BrowseArchiveComponent implements OnInit {
  @ViewChild('memContent') memContent!: ElementRef;
  @ViewChild('infoContent') infoContent!: ElementRef;

  [x: string]: any;
  id = this.route.snapshot.paramMap.get('id') as string;
  profile = {} as any;
  url = location.href;
  isAdmin: boolean = false;
  drop: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private arch: ArchieveApiService,
    private clipboardApi: ClipboardService,
    private auth: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.arch.getPersonById(this.id).subscribe((res) => {
      this.profile = res;
      this.replaceNewline();
    });

    this.auth.isAdmin.subscribe((x) => {
      this.isAdmin = x;
    });
  }

  display: string[] = [];

  replaceNewline() {
    this.profile.memoirs.forEach((element: any, index: number) => {
      this.profile.memoirs[index].memoir = element.memoir.split('\\n');
    });
  }
  SavePDF(pdfName: string): void {
    let doc = new jsPDF('p', 'pt', 'a4');
    let content;
    if (pdfName === 'memoirContent') {
      this.addWrappedText(this.profile.memoirs[0].memoir, 540, doc);
      doc.save(pdfName + '.pdf');
    } else {
      content = this.infoContent.nativeElement;
      doc.html(content, {
        callback: function (doc) {
          doc.save(pdfName + '.pdf');
        },
        x: 50,
        y: 50,
      });
    }
  }
  copyURL() {
    this.clipboardApi.copyFromContent(this.url);
  }

  updateCollapse() {
    this.drop = !this.drop;
  }

  addWrappedText(
    text,
    textWidth,
    doc,
    fontSize = 10,
    fontType = 'normal',
    lineSpacing = 20,
    xPosition = 40,
    initialYPosition = 50,
    pageWrapInitialYPosition = 50
  ) {
    var textLines = doc.splitTextToSize(text, textWidth); // Split the text into lines
    var pageHeight = doc.internal.pageSize.height; // Get page height, well use this for auto-paging

    doc.setFont(undefined, fontSize);
    doc.setFont(undefined, fontType);

    var cursorY = initialYPosition;

    textLines.forEach((lineText) => {
      if (cursorY + 50 > pageHeight) {
        doc.addPage();
        cursorY = pageWrapInitialYPosition;
      }
      doc.text(xPosition, cursorY, lineText);
      cursorY += lineSpacing;
    });
  }
}
