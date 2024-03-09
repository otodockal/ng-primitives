import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  booleanAttribute,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { injectRovingFocusGroup } from '../roving-focus-group/roving-focus-group.token';
import { NgpRovingFocusItemToken } from './roving-focus-item.token';

@Directive({
  standalone: true,
  selector: '[ngpRovingFocusItem]',
  exportAs: 'ngpRovingFocusItem',
  providers: [{ provide: NgpRovingFocusItemToken, useExisting: NgpRovingFocusItemDirective }],
  host: {
    '[attr.tabindex]': 'tabindex()',
  },
})
export class NgpRovingFocusItemDirective implements OnInit, OnDestroy {
  /**
   * Access the group the roving focus item belongs to.
   */
  private readonly group = injectRovingFocusGroup();

  /**
   * Access the focus monitor service.
   */
  private readonly focusMonitor = inject(FocusMonitor);

  /**
   * Access the element the roving focus item is attached to.
   */
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /**
   * Define the order of the roving focus item in the group.
   */
  readonly order = input<number, NumberInput>(0, {
    alias: 'ngpRovingFocusItemOrder',
    transform: numberAttribute,
  });

  /**
   * Define if the item is disabled.
   */
  readonly disabled = input<boolean, BooleanInput>(false, {
    alias: 'ngpRovingFocusItemDisabled',
    transform: booleanAttribute,
  });

  /**
   * Derive the tabindex of the roving focus item.
   */
  readonly tabindex = computed(() =>
    !this.group.disabled() && this.group.activeItem() === this ? 0 : -1,
  );

  /**
   * Initialize the roving focus item.
   */
  ngOnInit(): void {
    this.group.register(this);
  }

  /**
   * Clean up the roving focus item.
   */
  ngOnDestroy(): void {
    this.group.unregister(this);
  }

  /**
   * Forward the keydown event to the roving focus group.
   * @param event The keyboard event
   */
  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    this.group.onKeydown(event);
  }

  /**
   * Activate the roving focus item on click.
   */
  @HostListener('click')
  protected activate(): void {
    if (this.disabled()) {
      return;
    }

    this.group.setActiveItem(this, 'mouse');
  }

  /**
   * Focus the roving focus item.
   * @param origin The origin of the focus
   */
  focus(origin: FocusOrigin): void {
    this.focusMonitor.focusVia(this.elementRef, origin);
  }
}