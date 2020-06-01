<template>
  <div class="max-w-md">
    <ul class="flex m-2">
      <li class="flex-1">
        <a
          class="text-center block border rounded py-2 px-4 hover:text-blue-100 hover:bg-blue-700"
          :class="currentTab === 0 ? 'bg-blue-500 text-white': 'text-blue-500'"
          href="#"
          @click="changeTab(0)"
        >生成二维码</a>
      </li>
      <li class="flex-1">
        <a
          class="text-center block border rounded py-2 px-4 hover:text-blue-100 hover:bg-blue-700"
          :class="currentTab === 1 ? 'bg-blue-500 text-white': 'text-blue-500'"
          href="#"
          @click="changeTab(1)"
        >解析二维码</a>
      </li>
    </ul>
    <template v-if="currentTab === 0">
      <div class="flex flex-col items-center">
        <div class="flex items-center">
          <input
            v-model="inputContent"
            name="input"
            placeholder="Enter your content"
            class="flex-1 pr-1 pl-1 ml-1 mr-1 rounded-md shadow-md focus:outline-none focus:shadow-outline focus:border-purple-500"
          />
          <button
            @click="generateQr"
            class="flex-none operation hover:text-white hover:bg-purple-500 flex-initial"
          >生成二维码</button>
        </div>
        <img v-if="imageData!=null" :src="imageData" class="qr-image" />
        <button
          @click="downloadQr"
          class="operation hover:text-white hover:bg-purple-500 mb-4"
        >下载二维码</button>
      </div>
    </template>
    <template v-else>
      <div @paste="onPaste" class="flex flex-col items-center">
        <img v-if="inputImageData!=null" ref="inputImage" :src="inputImageData" class="qr-image" />
        <button @click="parseQr" class="operation hover:text-white hover:bg-purple-500 mb-2">解析二维码</button>
        <p
          @click="doCopy"
          class="m-2 text-base text-gray-600 leading-normal text-center"
        >{{ result }}</p>
        <canvas ref="canvas" width="400" height="300" style="display:none" />
      </div>
    </template>
  </div>
</template>

<script>
import imagePlaceholder from '../assets/image-placeholder.jpg'
import { Encoder, Decoder, ErrorCorrectionLevel } from '@nuintun/qrcode'

export default {
  data() {
    return {
      currentTab: 0,
      inputContent: '',
      imageData: imagePlaceholder,
      inputImageData: imagePlaceholder,
      result: '',
      parsedText: '',
    }
  },
  methods: {
    changeTab(tab) {
      this.currentTab = tab
    },
    generateQr() {
      const qrcode = new Encoder()
      qrcode.setEncodingHint(true)
      qrcode.setErrorCorrectionLevel(ErrorCorrectionLevel.H)
      qrcode.write(this.inputContent)
      qrcode.make()
      this.imageData = qrcode.toDataURL()
    },
    downloadQr() {
      const link = document.createElement('a')
      link.download = 'qr.gif'
      link.href = this.imageData
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    onPaste(event) {
      console.log('on paste', event)
      const { items } = event.clipboardData || event.originalEvent.clipboardData
      for (const item of items) {
        if (item.kind === 'file') {
          const blob = item.getAsFile()
          const reader = new FileReader()
          reader.onload = evt => {
            console.info(evt.target.result)
            this.inputImageData = evt.target.result
          }
          reader.readAsDataURL(blob)
        }
      }
    },
    parseQr() {
      const { canvas } = this.$refs
      const ctx = canvas.getContext('2d')
      const { width, height } = this.$refs.inputImage
      const image = new Image()
      image.src = this.inputImageData
      image.onload = () => {
        ctx.drawImage(image, 0, 0)
        const imageData = ctx.getImageData(0, 0, width, height)
        console.log(imageData)
        const qrcode = new Decoder()
        const decodedData = qrcode.decode(imageData.data, width, height)
        console.info(`decodedData: ${decodedData}`)
        if (decodedData == null || decodedData.data == null) {
          this.result = `解析错误!`
          this.parsedText = ''
          return
        }
        this.result = `解析结果:\n${decodedData.data}`
        this.parsedText = decodedData.data
      }
    },
    doCopy() {
      this.$copyText(this.parsedText).then(
        e => {
          this.$toasted.show('Copied !!', {
            theme: 'toasted-primary',
            position: 'bottom-center',
            Icon: 'info',
            fullWidth: false,
            duration: 1000,
          })
        },
        e => {
          this.$toasted.show('Can not copy !!', {
            theme: 'toasted-primary',
            position: 'bottom-center',
            Icon: 'info',
            duration: 1000,
          })
        }
      )
    },
  },
}
</script>

<style>
img.qr-image {
  @apply w-48 h-48 m-1;
}

button.operation {
  @apply text-purple-500 border-purple-500 text-xs font-semibold rounded px-4 py-1 leading-normal;
}
</style>
