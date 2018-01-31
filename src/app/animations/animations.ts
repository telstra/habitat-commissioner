import { trigger, style, transition, animate, keyframes, query, stagger, state } from '@angular/animations';

export class Animations {
  // public static slideInOut = trigger('slideInOut', [
  //   state('true', style({ height: '0px' })),
  //   state('false', style({ height: '*' })),
  //   transition('1 => 0', animate('500ms ease-in')),
  //   transition('0 => 1', animate('500ms ease-out'))
  // ]);

  public static flyInOut = trigger('flyInOut', [
    state('in', style({ transform: 'translateX(0)' })),
    transition('void => *', [
      animate(500, keyframes([
        style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
        style({ opacity: 1, transform: 'translateX(15px)', offset: 0.3 }),
        style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
      ]))
    ]),
    transition('* => void', [
      animate(300, keyframes([
        style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
        style({ opacity: 1, transform: 'translateX(-15px)', offset: 0.7 }),
        style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
      ]))
    ])
  ]);

  // public static listAnimation = trigger('listAnimation', [
  //   transition('* => *', [
  //     query(':enter', style({ opacity: 0 }), { optional: true }),
  //     query(':enter', stagger('300ms', [
  //       animate('1s ease-in', keyframes([
  //         style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
  //         style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
  //         style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
  //       ]))]), { optional: true }),
  //     query(':leave', stagger('300ms', [
  //       animate('1s ease-in', keyframes([
  //         style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
  //         style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
  //         style({ opacity: 0, transform: 'translateY(-75%)', offset: 1.0 }),
  //       ]))]), { optional: true })
  //   ])
  // ]);

  public static listItemAnimation = trigger('listItemAnimation', [
    transition('void => *', [
      query('a', style({ opacity: 0, transform: 'translateY(10px)' }), { optional: true }),
      query('a', stagger('100ms', [
        animate('350ms .5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]), { optional: true }),
      query('a', [
        animate(100, style('*'))
      ], { optional: true })
    ])
  ]);
}