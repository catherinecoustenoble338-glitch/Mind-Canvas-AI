import React from 'react';
import { WireframeType } from '@/store/useAppStore';
import { BlockVisualProps } from './utils';

// Import all block components
import * as MediaBlocks from './MediaBlocks';
import * as FeatureBlocks from './FeatureBlocks';
import * as HeaderBlocks from './HeaderBlocks';
import * as FormBlocks from './FormBlocks';
import * as ComponentBlocks from './ComponentBlocks';
import * as StructureBlocks from './StructureBlocks';

type BlockComponent = React.FC<BlockVisualProps>;

export const BlockRegistry: Record<WireframeType, BlockComponent> = {
  // Media Blocks
  'text_video': MediaBlocks.TextVideoBlock,
  'text': MediaBlocks.TextBlock,
  'text_image_blue': MediaBlocks.TextBlock, // Aliased to TextBlock as per original switch
  'two_col_images': MediaBlocks.TwoColImagesBlock,
  'two_col_images_text': MediaBlocks.TwoColImagesTextBlock,
  'images': MediaBlocks.ImagesBlock,
  'map': MediaBlocks.MapBlock,
  'left_text_on_image': MediaBlocks.LeftTextOnImageBlock,
  'vanilla_img_placeholder': MediaBlocks.VanillaImgPlaceholderBlock,
  'slider': MediaBlocks.SliderBlock,
  'slider_2_column': MediaBlocks.Slider2ColumnBlock,
  'text_image': MediaBlocks.TextBlock, // Fallback alias

  // Feature Blocks
  'features': FeatureBlocks.FeaturesBlock,
  'cta': FeatureBlocks.CtaBlock,
  'cta_image': FeatureBlocks.CtaImageBlock,
  'cards': FeatureBlocks.CardsBlock,
  'cards_red': FeatureBlocks.CardsBlock, // Aliased
  'slider_cards': FeatureBlocks.SliderCardsBlock,
  'buttons_left_aligned': FeatureBlocks.ButtonsLeftAlignedBlock,
  'hero_arrows': FeatureBlocks.HeroArrowsBlock,
  'features_list': FeatureBlocks.FeaturesBlock, // Fallback

  // Header Blocks
  'header': HeaderBlocks.HeaderBlock,
  'interface_header': HeaderBlocks.HeaderBlock, // Aliased
  'title': HeaderBlocks.TitleBlock,
  'features_green': HeaderBlocks.FeaturesGreenBlock,
  'table': HeaderBlocks.TableBlock,
  'bullets': HeaderBlocks.BulletsBlock,
  'mobile_top_bar': HeaderBlocks.MobileTopBarBlock,
  'no_logo_navigation': HeaderBlocks.NoLogoNavigationBlock,
  'articles': HeaderBlocks.ArticlesBlock,
  'profile': HeaderBlocks.ProfileBlock,

  // Form Blocks
  'form': FormBlocks.FormBlock,
  'sign_in': FormBlocks.SignInBlock,
  'text_sidebar_form': FormBlocks.TextSidebarFormBlock,
  'radiobuttons': FormBlocks.RadioButtonsBlock,
  'text_form': FormBlocks.TextFormBlock,
  'toggles': FormBlocks.TogglesBlock,
  'hamburger': FormBlocks.HamburgerBlock,
  'upload_button': FormBlocks.UploadButtonBlock,
  'next': FormBlocks.NextBlock,
  'table_row': FormBlocks.TableRowBlock,

  // Component Blocks (Cyan/Light Blue)
  'steps': ComponentBlocks.StepsBlock,
  'faq': ComponentBlocks.FaqBlock,
  'accordion': ComponentBlocks.FaqBlock, // Aliased
  'chart': ComponentBlocks.ChartBlock,
  'timeline': ComponentBlocks.TimelineBlock,
  'pagination': ComponentBlocks.PaginationBlock,
  'map_contacts': ComponentBlocks.MapContactsBlock,
  'table_of_contents': ComponentBlocks.TableOfContentsBlock,
  'invoice': ComponentBlocks.InvoiceBlock,
  'checklist': ComponentBlocks.ChecklistBlock,
  'plans': ComponentBlocks.PlansBlock,
  'catalog': ComponentBlocks.CatalogBlock,
  'carousel': ComponentBlocks.CarouselBlock,
  'rating': ComponentBlocks.StepsBlock, // Fallback/Placeholder

  // Structure Blocks
  'divider': StructureBlocks.DividerBlock,
  'footer': StructureBlocks.FooterBlock,
  'footer_green': StructureBlocks.FooterBlock, // Aliased
  'loading': StructureBlocks.LoadingBlock,
  'audio': StructureBlocks.AudioBlock,
  'post_thread': StructureBlocks.PostThreadBlock,
};

export const getBlockComponent = (type: WireframeType): BlockComponent => {
  return BlockRegistry[type] || ((props) => (
    <div className={props.className}>
      <span className="text-[9px] text-block-stroke font-medium font-apple-system">{props.type}</span>
    </div>
  ));
};
